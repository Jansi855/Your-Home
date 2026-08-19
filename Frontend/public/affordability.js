/**
 * YOUR HOME — LOAN AFFORDABILITY CALCULATOR ENGINE (v3)
 *
 * Determines the maximum loan a user can afford based on their
 * monthly gross income, expenses, existing EMIs, and desired savings.
 *
 * Core formula:
 *   Available Income = Gross Income − Expenses − Existing EMI − Savings
 *   Max Affordable New EMI = Available Income × 40%
 *   Max Loan = reverse-EMI(Max Affordable EMI, rate, tenure)
 *
 * Savings can be specified as a fixed ₹ amount or as a % of gross income.
 *
 * Architecture: a pure, DOM-free math module (unit-testable on its
 * own) + a thin rendering layer that binds it to the page. The
 * rendering layer never assumes an element exists — this script
 * degrades gracefully if the markup changes.
 */

'use strict';

(() => {
  // ==========================================================================
  // 1. FORMATTING — Indian digit grouping, lakh/crore scale, robust parsing
  // ==========================================================================

  const MAX_SANE_AMOUNT = 999_99_99_999; // ~99.99 Cr ceiling

  /** "1234567" -> "12,34,567" (Indian digit grouping, last 3 then pairs). */
  function groupIndian(digitStr) {
    if (digitStr.length <= 3) return digitStr;
    const last3 = digitStr.slice(-3);
    const rest = digitStr.slice(0, -3);
    return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  }

  function formatINR(amount, { symbol = true } = {}) {
    const n = Number.isFinite(amount) ? Math.round(Math.abs(amount)) : 0;
    const out = groupIndian(String(n));
    const sign = amount < 0 ? '-' : '';
    return symbol ? `₹ ${sign}${out}` : `${sign}${out}`;
  }

  /** Human scale: ₹45,000 stays as-is, ₹12L, ₹1.35Cr */
  function formatScaled(amount) {
    if (!Number.isFinite(amount) || amount <= 0) return '₹ 0';
    if (amount >= 1_00_00_000) return `₹ ${(amount / 1_00_00_000).toFixed(2)} Cr`;
    if (amount >= 1_00_000) return `₹ ${(amount / 1_00_000).toFixed(1)} L`;
    return formatINR(amount);
  }

  /** Strips ₹, commas, whitespace, stray non-digits; NaN-safe. */
  function parseINR(str) {
    if (str === null || str === undefined) return 0;
    const cleaned = String(str).replace(/[^\d.-]/g, '');
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  }

  function clamp(n, lo, hi) {
    return Math.min(hi, Math.max(lo, n));
  }

  // ==========================================================================
  // 2. MATH — pure functions, no DOM. Every input is sanitized; never
  //    throws, never returns NaN/Infinity.
  // ==========================================================================

  const AffordabilityMath = (() => {
    /** Standard reducing-balance EMI. */
    function emiForLoan(principal, annualRatePct, tenureMonths) {
      if (principal <= 0 || tenureMonths <= 0) return 0;
      const r = annualRatePct / 12 / 100;
      if (r <= 0) return principal / tenureMonths;
      const factor = Math.pow(1 + r, tenureMonths);
      return (principal * r * factor) / (factor - 1);
    }

    /** Inverse: how big a loan a given EMI budget supports. */
    function loanForEmi(emi, annualRatePct, tenureMonths) {
      if (emi <= 0 || tenureMonths <= 0) return 0;
      const r = annualRatePct / 12 / 100;
      if (r <= 0) return emi * tenureMonths;
      const factor = Math.pow(1 + r, tenureMonths);
      return (emi * (factor - 1)) / (r * factor);
    }

    function sanitizeAmount(n, fallback = 0) {
      const v = typeof n === 'number' ? n : parseFloat(n);
      if (!Number.isFinite(v) || v < 0) return fallback;
      return Math.min(v, MAX_SANE_AMOUNT);
    }

    /**
     * Core affordability computation.
     *
     * @param {object} input
     * @returns {object} fully-populated, finite result — safe to render.
     */
    function compute(input) {
      const grossIncome = sanitizeAmount(input.monthlyGrossIncome);
      const expenses = sanitizeAmount(input.monthlyExpenses);
      const existingEMIs = sanitizeAmount(input.existingEMIs);
      const annualRate = clamp(sanitizeAmount(input.annualRatePct, 8.5) || 8.5, 0.5, 20);
      const tenureYears = clamp(sanitizeAmount(input.tenureYears, 20) || 20, 1, 30);
      const tenureMonths = Math.round(tenureYears * 12);

      // Savings: fixed ₹ amount or % of gross income
      let monthlySavings;
      if (input.savingsMode === 'percentage') {
        const pct = clamp(sanitizeAmount(input.savingsPercent, 0), 0, 100);
        monthlySavings = Math.round(grossIncome * pct / 100);
      } else {
        monthlySavings = sanitizeAmount(input.monthlySavings);
      }

      const r = {
        grossIncome,
        expenses,
        existingEMIs,
        monthlySavings,
        annualRate,
        tenureYears,
        tenureMonths,
        status: 'no-income',     // 'no-income' | 'no-room' | 'ok'
        savingsPercentOfIncome: 0,
        availableIncome: 0,
        maxAffordableEMI: 0,
        maxLoanAmount: 0,
        totalMonthlyEMI: 0,
        finalRemaining: 0,
        // Donut percentages
        newEmiPct: 0,
        existingEmiPct: 0,
        expensesPct: 0,
        savingsPct: 0,
        remainingPct: 0,
      };

      if (grossIncome <= 0) return r;

      r.savingsPercentOfIncome = Math.round((monthlySavings / grossIncome) * 100);

      // Deductions before affordability check
      const deductions = expenses + existingEMIs + monthlySavings;

      if (deductions >= grossIncome) {
        r.status = 'no-room';
        r.availableIncome = 0;
        return r;
      }

      r.availableIncome = grossIncome - deductions;

      // Max Affordable New EMI = 40% of Available Income
      r.maxAffordableEMI = Math.round(r.availableIncome * 0.40);

      if (r.maxAffordableEMI <= 0) {
        r.status = 'no-room';
        return r;
      }

      r.status = 'ok';

      // Back-calculate the max loan principal from the EMI budget
      r.maxLoanAmount = Math.round(loanForEmi(r.maxAffordableEMI, annualRate, tenureMonths));

      // Total monthly EMI = existing + new
      r.totalMonthlyEMI = existingEMIs + r.maxAffordableEMI;

      // Final remaining = gross − expenses − total EMI − savings
      r.finalRemaining = Math.max(0,
        grossIncome - expenses - r.totalMonthlyEMI - monthlySavings);

      // Donut percentages — computed from actual amounts, normalized to 100
      const rawNew = (r.maxAffordableEMI / grossIncome) * 100;
      const rawExisting = (existingEMIs / grossIncome) * 100;
      const rawExp = (expenses / grossIncome) * 100;
      const rawSav = (monthlySavings / grossIncome) * 100;
      const rawRem = Math.max(0, (r.finalRemaining / grossIncome) * 100);
      const rawTotal = rawNew + rawExisting + rawExp + rawSav + rawRem || 1;

      r.newEmiPct = Math.round((rawNew / rawTotal) * 100);
      r.existingEmiPct = Math.round((rawExisting / rawTotal) * 100);
      r.expensesPct = Math.round((rawExp / rawTotal) * 100);
      r.savingsPct = Math.round((rawSav / rawTotal) * 100);
      r.remainingPct = Math.max(0,
        100 - r.newEmiPct - r.existingEmiPct - r.expensesPct - r.savingsPct);

      return r;
    }

    return { compute, emiForLoan, loanForEmi };
  })();

  // ==========================================================================
  // 3. DOM BINDING — defensive: nothing throws if an element is absent
  // ==========================================================================

  function init() {
    const $ = (id) => document.getElementById(id);

    const el = {
      // Inputs
      income:          $('afford-income-input'),
      expenses:        $('afford-expenses-input'),
      emis:            $('afford-emis-input'),
      savings:         $('afford-savings-input'),
      savingsPctInput: $('afford-savings-pct-input'),
      savingsAmountWrap: $('savings-amount-wrap'),
      savingsPctWrap:    $('savings-pct-wrap'),
      savingsDisplay:    $('savings-computed'),
      rate:            $('afford-rate-input'),
      tenure:          $('afford-tenure-input'),

      // Toggle buttons
      toggleAmount: $('toggle-savings-amount'),
      togglePct:    $('toggle-savings-pct'),

      // Action buttons
      btnCheck: $('btn-check-affordability'),
      btnReset: $('btn-reset-affordability'),

      // Hero
      heroLoan:     $('stat-hero-loan'),
      heroStatus:   $('stat-hero-status'),
      heroSublabel: $('stat-hero-sublabel'),

      // Stat cards
      statAvailIncome:    $('stat-available-income'),
      statMaxEmi:         $('stat-max-emi'),
      statTotalEmi:       $('stat-total-emi'),
      statFinalRemaining: $('stat-final-remaining'),

      // Donut slices
      sliceNewEmi:     $('slice-new-emi'),
      sliceExistingEmi: $('slice-existing-emi'),
      sliceExpenses:   $('slice-expenses'),
      sliceSavings:    $('slice-savings'),
      sliceRemaining:  $('slice-remaining'),

      // Allocation legend
      allocNewEmi:     $('alloc-new-emi-val'),
      allocExistingEmi: $('alloc-existing-emi-val'),
      allocExpenses:   $('alloc-expenses-val'),
      allocSavings:    $('alloc-savings-val'),
      allocRemaining:  $('alloc-remaining-val'),
      allocTotalIncome: $('alloc-total-income'),

      // Breakdown table
      bkGrossIncome:    $('bk-gross-income'),
      bkExpenses:       $('bk-expenses'),
      bkExistingEmi:    $('bk-existing-emi'),
      bkSavings:        $('bk-savings'),
      bkAvailableIncome: $('bk-available-income'),
      bkMaxEmi:         $('bk-max-emi'),
      bkRateTenure:     $('bk-rate-tenure'),
      bkMaxLoan:        $('bk-max-loan'),
      bkTotalEmi:       $('bk-total-emi'),
      bkFinalRemaining: $('bk-final-remaining'),
      bkMonthlySavings: $('bk-monthly-savings'),

      // Accessibility
      liveRegion: $('afford-live-region'),
    };

    const REQUIRED = ['income', 'expenses', 'emis', 'savings', 'heroLoan'];
    const missing = REQUIRED.filter((k) => !el[k]);
    if (missing.length) {
      console.warn('[affordability-engine] Missing required elements, aborting init:', missing);
      return;
    }

    const CIRCLE_RADIUS = 58;
    const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

    // ---- text helpers that no-op on missing elements ----
    const setText = (node, value) => { if (node) node.textContent = value; };
    const setHTML = (node, value) => { if (node) node.innerHTML = value; };

    let currentSavingsMode = 'amount';

    // ---- Live formatting ----
    /** Preserves cursor position (counted in digits, not characters) across reformatting. */
    function liveFormatInput(input) {
      const selStart = input.selectionStart ?? input.value.length;
      const digitsBeforeCursor = (input.value.slice(0, selStart).match(/\d/g) || []).length;
      const rawDigits = input.value.replace(/\D/g, '');

      if (!rawDigits) {
        input.value = '';
        return;
      }

      const numeric = Math.min(parseInt(rawDigits, 10), MAX_SANE_AMOUNT);
      const formatted = groupIndian(String(numeric));
      input.value = formatted;

      let pos = formatted.length;
      if (digitsBeforeCursor <= 0) {
        pos = 0;
      } else {
        let seen = 0;
        for (let i = 0; i < formatted.length; i++) {
          if (/\d/.test(formatted[i])) seen++;
          if (seen === digitsBeforeCursor) { pos = i + 1; break; }
        }
      }
      input.setSelectionRange(pos, pos);
    }

    function readInputs() {
      return {
        monthlyGrossIncome: parseINR(el.income.value),
        monthlyExpenses:    parseINR(el.expenses.value),
        existingEMIs:       parseINR(el.emis.value),
        savingsMode:        currentSavingsMode,
        monthlySavings:     parseINR(el.savings.value),
        savingsPercent:     el.savingsPctInput ? parseFloat(el.savingsPctInput.value) || 0 : 0,
        annualRatePct:      el.rate ? parseFloat(el.rate.value) : undefined,
        tenureYears:        el.tenure ? parseFloat(el.tenure.value) : undefined,
      };
    }

    function updateDonut(shares) {
      let offset = 0;
      shares.forEach(({ node, pct }) => {
        if (!node) return;
        const len = (pct / 100) * CIRCUMFERENCE;
        node.style.strokeDasharray = `${len} ${CIRCUMFERENCE - len}`;
        node.style.strokeDashoffset = `-${offset}`;
        offset += len;
      });
    }

    function updateSavingsDisplay(r) {
      if (!el.savingsDisplay) return;
      if (r.grossIncome <= 0) {
        el.savingsDisplay.textContent = '';
        return;
      }
      el.savingsDisplay.textContent =
        `${formatINR(r.monthlySavings)} · ${r.savingsPercentOfIncome}% of gross income`;
    }

    function render(r) {
      const affordable = r.status === 'ok';

      // ---- Hero card ----
      setText(el.heroLoan, affordable ? formatScaled(r.maxLoanAmount) : '—');
      setText(el.heroStatus, affordable
        ? 'Maximum Loan You Can Afford'
        : r.status === 'no-income'
          ? 'Enter your income to get started'
          : 'Your obligations exceed your income — no additional loan is affordable');
      setText(el.heroSublabel, affordable
        ? `At ${r.annualRate.toFixed(2)}% for ${r.tenureYears} years`
        : '');

      // ---- Stat cards ----
      setText(el.statAvailIncome, affordable ? formatINR(r.availableIncome) : '—');
      setHTML(el.statMaxEmi, affordable
        ? `${formatINR(r.maxAffordableEMI)} <span class="unit-inline">/mo</span>`
        : '—');
      setHTML(el.statTotalEmi, affordable
        ? `${formatINR(r.totalMonthlyEMI)} <span class="unit-inline">/mo</span>`
        : '—');
      setText(el.statFinalRemaining, affordable ? formatINR(r.finalRemaining) : '—');

      // ---- Donut chart ----
      updateDonut([
        { node: el.sliceNewEmi,     pct: affordable ? r.newEmiPct : 0 },
        { node: el.sliceExistingEmi, pct: affordable ? r.existingEmiPct : 0 },
        { node: el.sliceExpenses,   pct: affordable ? r.expensesPct : (r.grossIncome > 0 ? 100 : 0) },
        { node: el.sliceSavings,    pct: affordable ? r.savingsPct : 0 },
        { node: el.sliceRemaining,  pct: affordable ? r.remainingPct : 0 },
      ]);

      // ---- Allocation legend ----
      setText(el.allocNewEmi, affordable
        ? `${formatINR(r.maxAffordableEMI)} (${r.newEmiPct}%)`
        : '₹ 0 (0%)');
      setText(el.allocExistingEmi,
        `${formatINR(r.existingEMIs)} (${affordable ? r.existingEmiPct : 0}%)`);
      setText(el.allocExpenses,
        `${formatINR(r.expenses)} (${affordable
          ? r.expensesPct
          : Math.min(100, Math.round((r.expenses / (r.grossIncome || 1)) * 100))}%)`);
      setText(el.allocSavings,
        `${formatINR(r.monthlySavings)} (${affordable ? r.savingsPct : 0}%)`);
      setText(el.allocRemaining,
        `${formatINR(affordable ? r.finalRemaining : 0)} (${affordable ? r.remainingPct : 0}%)`);
      setText(el.allocTotalIncome, formatINR(r.grossIncome));

      // ---- Breakdown table ----
      setText(el.bkGrossIncome,    formatINR(r.grossIncome));
      setText(el.bkExpenses,       `− ${formatINR(r.expenses)}`);
      setText(el.bkExistingEmi,    `− ${formatINR(r.existingEMIs)}`);
      setText(el.bkSavings,        `− ${formatINR(r.monthlySavings)}`);
      setText(el.bkAvailableIncome, formatINR(r.availableIncome));
      setText(el.bkMaxEmi,         affordable
        ? `${formatINR(r.maxAffordableEMI)} /mo`
        : '—');
      setText(el.bkRateTenure,     `${r.annualRate.toFixed(2)}% · ${r.tenureYears} yrs`);
      setText(el.bkMaxLoan,        affordable ? formatScaled(r.maxLoanAmount) : '—');
      setText(el.bkTotalEmi,       affordable
        ? `${formatINR(r.totalMonthlyEMI)} /mo`
        : '—');
      setText(el.bkFinalRemaining, affordable ? formatINR(r.finalRemaining) : '—');
      setText(el.bkMonthlySavings, formatINR(r.monthlySavings));

      // ---- Savings display ----
      updateSavingsDisplay(r);

      // ---- Error state ----
      if (el.income) el.income.classList.toggle('has-error', r.status === 'no-income');

      // ---- Accessibility ----
      if (el.liveRegion) {
        el.liveRegion.textContent = affordable
          ? `Maximum eligible loan: ${formatScaled(r.maxLoanAmount)}`
          : 'No additional loan is currently affordable';
      }

      return r;
    }

    let lastResult = null;

    function recalculate() {
      lastResult = render(AffordabilityMath.compute(readInputs()));
      return lastResult;
    }

    // ---- Savings mode toggle ----
    function setSavingsMode(mode) {
      currentSavingsMode = mode;
      if (el.savingsAmountWrap) {
        el.savingsAmountWrap.style.display = mode === 'amount' ? '' : 'none';
      }
      if (el.savingsPctWrap) {
        el.savingsPctWrap.style.display = mode === 'percentage' ? '' : 'none';
      }
      if (el.toggleAmount) el.toggleAmount.classList.toggle('active', mode === 'amount');
      if (el.togglePct) el.togglePct.classList.toggle('active', mode === 'percentage');
      recalculate();
    }

    if (el.toggleAmount) {
      el.toggleAmount.addEventListener('click', () => setSavingsMode('amount'));
    }
    if (el.togglePct) {
      el.togglePct.addEventListener('click', () => setSavingsMode('percentage'));
    }

    // ---- Currency input events ----
    const currencyInputs = [el.income, el.expenses, el.emis, el.savings].filter(Boolean);
    currencyInputs.forEach((input) => {
      input.addEventListener('input', () => { liveFormatInput(input); recalculate(); });
      input.addEventListener('blur', () => {
        const raw = parseINR(input.value);
        input.value = raw > 0 ? groupIndian(String(Math.round(raw))) : '';
        recalculate();
      });
      input.addEventListener('focus', () => setTimeout(() => input.select(), 0));
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') input.blur(); });
    });

    // Rate, tenure, and savings percentage
    if (el.rate) el.rate.addEventListener('input', recalculate);
    if (el.tenure) el.tenure.addEventListener('input', recalculate);
    if (el.savingsPctInput) el.savingsPctInput.addEventListener('input', recalculate);

    // ---- Check button ----
    if (el.btnCheck) {
      el.btnCheck.addEventListener('click', () => {
        recalculate();
        if (window.innerWidth <= 1024) {
          document.querySelector('.results-summary-panel')?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // ---- Reset button ----
    if (el.btnReset) {
      el.btnReset.addEventListener('click', () => {
        el.income.value = '1,00,000';
        el.expenses.value = '40,000';
        el.emis.value = '10,000';
        el.savings.value = '20,000';
        if (el.savingsPctInput) el.savingsPctInput.value = '20';
        if (el.rate) el.rate.value = '8.5';
        if (el.tenure) el.tenure.value = '20';
        setSavingsMode('amount');
        recalculate();
      });
    }

    // ---- Initial calculation ----
    recalculate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Exposed only for console/unit testing — no page code depends on this.
  window.__affordabilityMath = AffordabilityMath;
})();