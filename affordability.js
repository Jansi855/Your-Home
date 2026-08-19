/**
 * YOUR HOME - AFFORDABILITY CHECK ENGINE
 * Real-time FOIR, Maximum Loan Eligibility, Affordable Property Price Range & SVG Income Allocation Donut
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Inputs
  const affordIncomeInput = document.getElementById('afford-income-input');
  const affordExpensesInput = document.getElementById('afford-expenses-input');
  const affordEmisInput = document.getElementById('afford-emis-input');
  const affordSavingsInput = document.getElementById('afford-savings-input');
  const affordDownpaymentInput = document.getElementById('afford-downpayment-input');

  // DOM Elements - Buttons
  const btnCheckAffordability = document.getElementById('btn-check-affordability');
  const btnResetAffordability = document.getElementById('btn-reset-affordability');
  const btnSeeHow = document.getElementById('btn-see-how');

  // DOM Elements - Hero & Top Stat Displays
  const statHeroRange = document.getElementById('stat-hero-range');
  const statMaxLoan = document.getElementById('stat-max-loan');
  const statRecommendedEmi = document.getElementById('stat-recommended-emi');
  const statAffordablePrice = document.getElementById('stat-affordable-price');
  const statEmiPct = document.getElementById('stat-emi-pct');

  // DOM Elements - Detailed Allocation Breakdown & Slices
  const sliceEmi = document.getElementById('slice-emi');
  const sliceExpenses = document.getElementById('slice-expenses');
  const sliceSavings = document.getElementById('slice-savings');

  const allocEmiVal = document.getElementById('alloc-emi-val');
  const allocExpensesVal = document.getElementById('alloc-expenses-val');
  const allocSavingsVal = document.getElementById('alloc-savings-val');
  const allocTotalIncome = document.getElementById('alloc-total-income');
  const meaningRangeVal = document.getElementById('meaning-range-val');

  // SVG Donut Constants for r=58
  const CIRCLE_RADIUS = 58;
  const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS; // ~364.4247

  // --------------------------------------------------------------------------
  // CURRENCY & NUMBER FORMATTING
  // --------------------------------------------------------------------------
  function formatINR(amount, includeSymbol = true) {
    if (isNaN(amount) || amount === null) return includeSymbol ? '₹ 0' : '0';
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(Math.round(amount));
    return includeSymbol ? `₹ ${formatted}` : formatted;
  }

  function formatLakhs(amount) {
    if (isNaN(amount) || amount === null) return '₹ 0.0 L';
    const inLakhs = (amount / 100000).toFixed(1);
    return `₹ ${inLakhs} L`;
  }

  function parseINR(str) {
    if (!str) return 0;
    return parseFloat(str.toString().replace(/,/g, '').replace(/₹/g, '').trim()) || 0;
  }

  // --------------------------------------------------------------------------
  // CORE AFFORDABILITY CALCULATION
  // --------------------------------------------------------------------------
  function calculateAffordability() {
    const monthlyIncome = parseINR(affordIncomeInput.value) || 100000;
    const monthlyExpenses = parseINR(affordExpensesInput.value) || 40000;
    const existingEMIs = parseINR(affordEmisInput.value) || 0;
    const monthlySavings = parseINR(affordSavingsInput.value) || 0;
    const downPayment = parseINR(affordDownpaymentInput.value) || 1200000;

    // 1. Recommended Housing EMI
    const maxPermissibleEMI = Math.max(0, (monthlyIncome * 0.50) - existingEMIs);
    const availableForEMI = Math.max(0, monthlyIncome - monthlyExpenses - existingEMIs - monthlySavings);
    
    // Cap recommended EMI at 40% of income
    const maxRecommendedEMI = monthlyIncome * 0.40;
    const recommendedHousingEMI = Math.max(0, Math.min(availableForEMI, maxPermissibleEMI, maxRecommendedEMI));
    
    const emiPercentage = Math.round((recommendedHousingEMI / monthlyIncome) * 100) || 0;

    // 2. Maximum Loan Eligibility Calculation (At 8.50% p.a. for 20 years / 240 months)
    const annualRate = 8.5;
    const tenureMonths = 240;
    const monthlyRate = annualRate / 12 / 100;
    const factor = Math.pow(1 + monthlyRate, tenureMonths);

    const maxLoanRaw = (maxPermissibleEMI * (factor - 1)) / (monthlyRate * factor);
    const maxLoanAmount = Math.round(maxLoanRaw > 0 ? maxLoanRaw : 0);

    // 3. Affordable Property Price Range (Lower bound = recommended comfort, Upper bound = full capability)
    const recommendedLoanRaw = (recommendedHousingEMI * (factor - 1)) / (monthlyRate * factor);
    const recommendedLoanAmount = Math.round(recommendedLoanRaw > 0 ? recommendedLoanRaw : 0);
    
    const minAffordable = Math.round(recommendedLoanAmount + downPayment);
    const maxAffordable = Math.round(maxLoanAmount + downPayment);

    const isUnaffordable = (recommendedHousingEMI <= 0 || maxLoanAmount <= 0);

    // Format formatted ranges
    let rangeText = "";
    if (isUnaffordable) {
      rangeText = "Currently Unaffordable";
    } else {
      rangeText = minAffordable === maxAffordable 
        ? formatLakhs(maxAffordable) 
        : `${formatLakhs(minAffordable)} – ${formatLakhs(maxAffordable)}`;
    }

    // 4. Income Allocation Breakdown
    const otherExpensesAmount = monthlyExpenses + existingEMIs;
    const otherExpensesPct = Math.round((otherExpensesAmount / monthlyIncome) * 100) || 0;
    
    const surplusSavingsAmount = Math.max(0, monthlyIncome - recommendedHousingEMI - otherExpensesAmount);
    const surplusSavingsPct = Math.max(0, 100 - emiPercentage - otherExpensesPct);

    // Normalize for donut chart if expenses are too high
    let totalPct = emiPercentage + otherExpensesPct + surplusSavingsPct;
    let normEmiPct = emiPercentage;
    let normExpensesPct = otherExpensesPct;
    let normSavingsPct = surplusSavingsPct;
    
    if (totalPct > 100) {
      normEmiPct = Math.min(100, emiPercentage);
      normExpensesPct = Math.min(100 - normEmiPct, otherExpensesPct);
      normSavingsPct = Math.max(0, 100 - normEmiPct - normExpensesPct);
    }

    // ------------------------------------------------------------------------
    // UPDATE DOM DISPLAYS
    // ------------------------------------------------------------------------
    statHeroRange.textContent = rangeText;
    statMaxLoan.textContent = isUnaffordable ? "₹ 0 L" : formatLakhs(maxLoanAmount);
    statRecommendedEmi.innerHTML = isUnaffordable 
      ? `₹ 0 <span class="unit-inline">/mo</span>` 
      : `${formatINR(recommendedHousingEMI)} <span class="unit-inline">/mo</span>`;
    statAffordablePrice.textContent = rangeText;
    statEmiPct.textContent = `${emiPercentage}%`;

    // Detailed Breakdown List
    allocEmiVal.textContent = `${formatINR(recommendedHousingEMI)} (${emiPercentage}%)`;
    allocExpensesVal.textContent = `${formatINR(otherExpensesAmount)} (${otherExpensesPct}%)`;
    allocSavingsVal.textContent = `${formatINR(surplusSavingsAmount)} (${surplusSavingsPct}%)`;
    allocTotalIncome.textContent = formatINR(monthlyIncome);

    meaningRangeVal.textContent = isUnaffordable 
      ? "Please reduce expenses or existing EMIs to afford a property."
      : `${rangeText}.`;

    // ------------------------------------------------------------------------
    // SVG DONUT ALLOCATION SLICES
    // ------------------------------------------------------------------------
    updateDonutSegments([
      { el: sliceEmi, pct: normEmiPct },
      { el: sliceExpenses, pct: normExpensesPct },
      { el: sliceSavings, pct: normSavingsPct }
    ]);
  }

  function updateDonutSegments(segments) {
    let accumulatedOffset = 0;

    segments.forEach((seg) => {
      if (!seg.el) return;
      const strokeLength = (seg.pct / 100) * CIRCUMFERENCE;
      const remainingLength = CIRCUMFERENCE - strokeLength;

      seg.el.style.strokeDasharray = `${strokeLength} ${remainingLength}`;
      seg.el.style.strokeDashoffset = `-${accumulatedOffset}`;

      accumulatedOffset += strokeLength;
    });
  }

  // --------------------------------------------------------------------------
  // EVENT LISTENERS
  // --------------------------------------------------------------------------
  const inputs = [
    affordIncomeInput,
    affordExpensesInput,
    affordEmisInput,
    affordSavingsInput,
    affordDownpaymentInput
  ];

  inputs.forEach((inp) => {
    if (!inp) return;
    
    inp.addEventListener('input', () => {
      calculateAffordability();
    });

    inp.addEventListener('blur', () => {
      const raw = parseINR(inp.value);
      inp.value = formatINR(raw, false);
      calculateAffordability();
    });
  });

  btnCheckAffordability.addEventListener('click', () => {
    calculateAffordability();
    if (window.innerWidth <= 1024) {
      document.querySelector('.results-summary-panel').scrollIntoView({ behavior: 'smooth' });
    }
  });

  btnResetAffordability.addEventListener('click', () => {
    affordIncomeInput.value = '1,00,000';
    affordExpensesInput.value = '40,000';
    affordEmisInput.value = '10,000';
    affordSavingsInput.value = '20,000';
    affordDownpaymentInput.value = '12,00,000';
    calculateAffordability();
  });

  if (btnSeeHow) {
    btnSeeHow.addEventListener('click', () => {
      alert('Pro Tip: Increasing your down payment by even 10% can lower your monthly EMI by ₹ 5,000+ and save lakhs in total interest over 20 years!');
    });
  }

  // --------------------------------------------------------------------------
  // INITIALIZE ON LOAD
  // --------------------------------------------------------------------------
  calculateAffordability();
});
