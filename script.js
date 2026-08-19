/**
 * YOUR HOME - EMI CALCULATOR ENGINE
 * Real-time calculation, Indian currency formatting, SVG donut chart, and amortization schedule.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Inputs & Sliders
  const loanAmountInput = document.getElementById('loan-amount-input');
  const loanAmountSlider = document.getElementById('loan-amount-slider');
  
  const interestRateInput = document.getElementById('interest-rate-input');
  const interestRateSlider = document.getElementById('interest-rate-slider');
  
  const tenureSelect = document.getElementById('tenure-select');
  const tenureSlider = document.getElementById('tenure-slider');
  const tenureMinMaxLabels = document.getElementById('tenure-minmax-labels');
  const unitYearsBtn = document.getElementById('unit-years');
  const unitMonthsBtn = document.getElementById('unit-months');

  // Buttons
  const btnCalculate = document.getElementById('btn-calculate');
  const btnReset = document.getElementById('btn-reset');
  const btnToggleSchedule = document.getElementById('btn-toggle-schedule');
  const btnCloseSchedule = document.getElementById('btn-close-schedule');
  const scheduleDrawer = document.getElementById('schedule-drawer');
  const scheduleTbody = document.getElementById('schedule-tbody');

  // Stat Displays
  const statMonthlyEmi = document.getElementById('stat-monthly-emi');
  const statTotalInterest = document.getElementById('stat-total-interest');
  const statTotalPayment = document.getElementById('stat-total-payment');
  const statPrincipal = document.getElementById('stat-principal');
  const statTenure = document.getElementById('stat-tenure');
  const affordabilityPill = document.getElementById('affordability-pill');

  // Donut Chart & Legend Displays
  const legendPrincipalVal = document.getElementById('legend-principal-val');
  const legendInterestVal = document.getElementById('legend-interest-val');
  const chartSlicePrincipal = document.getElementById('chart-slice-principal');
  const chartSliceInterest = document.getElementById('chart-slice-interest');
  const chartCenterTotal = document.getElementById('chart-center-total');

  // Breakdown Table Displays
  const tblMonthlyEmi = document.getElementById('tbl-monthly-emi');
  const tblPrincipalMonthly = document.getElementById('tbl-principal-monthly');
  const tblInterestMonthly = document.getElementById('tbl-interest-monthly');

  // State
  let tenureUnit = 'years'; // 'years' | 'months'
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 62; // ~389.55 for r=62

  // --------------------------------------------------------------------------
  // CURRENCY & NUMBER FORMATTING (Indian Number System: 50,00,000)
  // --------------------------------------------------------------------------
  function formatINR(amount, includeSymbol = true) {
    if (isNaN(amount) || amount === null) return includeSymbol ? '₹ 0' : '0';
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(Math.round(amount));
    return includeSymbol ? `₹ ${formatted}` : formatted;
  }

  function parseFormattedNumber(str) {
    if (!str) return 0;
    return parseFloat(str.toString().replace(/,/g, '').replace(/₹/g, '').trim()) || 0;
  }

  // Update background track color gradient of range sliders
  function updateSliderFill(slider) {
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value) || 0;
    const percentage = ((val - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, #15803d 0%, #15803d ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
  }

  // --------------------------------------------------------------------------
  // CORE EMI CALCULATION FORMULA
  // E = P * r * (1 + r)^n / ((1 + r)^n - 1)
  // --------------------------------------------------------------------------
  function calculateEMI() {
    const principal = parseFormattedNumber(loanAmountInput.value) || 5000000;
    const annualRate = parseFloat(interestRateInput.value) || 8.5;
    let tenureVal = parseFloat(tenureSlider.value) || 20;
    const months = tenureUnit === 'years' ? tenureVal * 12 : tenureVal;

    if (principal <= 0 || annualRate <= 0 || months <= 0) return;

    const monthlyRate = annualRate / 12 / 100;
    const rateFactor = Math.pow(1 + monthlyRate, months);
    
    // Monthly EMI
    const monthlyEMI = Math.round((principal * monthlyRate * rateFactor) / (rateFactor - 1));
    
    // Total Payment & Total Interest
    const totalPayment = Math.round(monthlyEMI * months);
    const totalInterest = Math.round(totalPayment - principal);

    // Average Monthly Principal & Interest portions
    const avgMonthlyPrincipal = Math.round(principal / months);
    const avgMonthlyInterest = Math.round(totalInterest / months);

    // 1. Update 5 Metric Cards
    statMonthlyEmi.textContent = formatINR(monthlyEMI);
    statTotalInterest.textContent = formatINR(totalInterest);
    statTotalPayment.textContent = formatINR(totalPayment);
    statPrincipal.textContent = formatINR(principal);
    statTenure.textContent = tenureUnit === 'years' ? `${tenureVal} Years` : `${tenureVal} Months`;

    // Affordability Pill status
    if (affordabilityPill) {
      if (monthlyEMI <= 50000) {
        affordabilityPill.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Affordable EMI</span>
        `;
        affordabilityPill.style.backgroundColor = 'var(--mint-badge)';
        affordabilityPill.style.color = 'var(--primary-green)';
      } else if (monthlyEMI <= 120000) {
        affordabilityPill.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span>Moderate EMI</span>
        `;
        affordabilityPill.style.backgroundColor = '#fef3c7';
        affordabilityPill.style.color = '#d97706';
      } else {
        affordabilityPill.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span>High EMI</span>
        `;
        affordabilityPill.style.backgroundColor = '#fee2e2';
        affordabilityPill.style.color = '#dc2626';
      }
    }

    // 2. Update Breakdown Table
    tblMonthlyEmi.textContent = formatINR(monthlyEMI);
    tblPrincipalMonthly.textContent = formatINR(avgMonthlyInterest);
    tblInterestMonthly.textContent = formatINR(avgMonthlyPrincipal);

    // 3. Update Amortization Legend & Donut Chart
    legendPrincipalVal.textContent = formatINR(principal);
    legendInterestVal.textContent = formatINR(totalInterest);
    chartCenterTotal.textContent = formatINR(totalPayment);

    // Calculate Donut Slices
    const principalPercent = principal / totalPayment;
    const principalOffset = CIRCLE_CIRCUMFERENCE * (1 - principalPercent);

    if (chartSlicePrincipal) {
      chartSlicePrincipal.style.strokeDasharray = `${CIRCLE_CIRCUMFERENCE}`;
      chartSlicePrincipal.style.strokeDashoffset = `${principalOffset}`;
    }

    if (chartSliceInterest) {
      chartSliceInterest.style.strokeDasharray = `${CIRCLE_CIRCUMFERENCE}`;
      chartSliceInterest.style.strokeDashoffset = '0';
    }

    // 4. Update Yearly Schedule Table if opened
    generateYearlySchedule(principal, annualRate, months, monthlyEMI);
  }

  // Generate Year-by-Year Repayment Amortization Schedule
  function generateYearlySchedule(principal, annualRate, totalMonths, monthlyEMI) {
    if (!scheduleTbody) return;

    let balance = principal;
    const monthlyRate = annualRate / 12 / 100;
    const totalYears = Math.ceil(totalMonths / 12);
    let rowsHtml = '';

    for (let year = 1; year <= totalYears; year++) {
      const openingBalance = balance;
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;

      for (let m = 1; m <= 12; m++) {
        if (balance <= 0) break;
        const interest = balance * monthlyRate;
        let principalPaid = monthlyEMI - interest;
        if (principalPaid > balance) principalPaid = balance;

        yearlyInterest += interest;
        yearlyPrincipal += principalPaid;
        balance -= principalPaid;
      }

      const totalYearlyPaid = yearlyPrincipal + yearlyInterest;

      rowsHtml += `
        <tr>
          <td>Year ${year}</td>
          <td>${formatINR(openingBalance)}</td>
          <td style="color: var(--accent-green); font-weight: 600;">${formatINR(yearlyPrincipal)}</td>
          <td>${formatINR(yearlyInterest)}</td>
          <td>${formatINR(totalYearlyPaid)}</td>
          <td style="font-weight: 600;">${formatINR(Math.max(0, balance))}</td>
        </tr>
      `;

      if (balance <= 0) break;
    }

    scheduleTbody.innerHTML = rowsHtml;
  }

  // --------------------------------------------------------------------------
  // EVENT LISTENERS & TWO-WAY SYNC
  // --------------------------------------------------------------------------

  // Loan Amount Input & Slider Sync
  loanAmountSlider.addEventListener('input', () => {
    const val = parseFloat(loanAmountSlider.value);
    loanAmountInput.value = formatINR(val, false);
    updateSliderFill(loanAmountSlider);
    calculateEMI();
  });

  loanAmountInput.addEventListener('input', () => {
    const rawVal = parseFormattedNumber(loanAmountInput.value);
    loanAmountSlider.value = Math.min(Math.max(rawVal, parseFloat(loanAmountSlider.min)), parseFloat(loanAmountSlider.max));
    updateSliderFill(loanAmountSlider);
    calculateEMI();
  });

  loanAmountInput.addEventListener('blur', () => {
    const rawVal = parseFormattedNumber(loanAmountInput.value);
    loanAmountInput.value = formatINR(rawVal, false);
  });

  // Interest Rate Input & Slider Sync
  interestRateSlider.addEventListener('input', () => {
    interestRateInput.value = parseFloat(interestRateSlider.value).toFixed(2);
    updateSliderFill(interestRateSlider);
    calculateEMI();
  });

  interestRateInput.addEventListener('input', () => {
    const val = parseFloat(interestRateInput.value) || 0;
    interestRateSlider.value = val;
    updateSliderFill(interestRateSlider);
    calculateEMI();
  });

  // Loan Tenure Select & Slider Sync
  tenureSlider.addEventListener('input', () => {
    const val = tenureSlider.value;
    updateSliderFill(tenureSlider);
    syncTenureSelect(val);
    calculateEMI();
  });

  tenureSelect.addEventListener('change', () => {
    const val = tenureSelect.value;
    tenureSlider.value = val;
    updateSliderFill(tenureSlider);
    calculateEMI();
  });

  function syncTenureSelect(val) {
    let matched = false;
    for (let opt of tenureSelect.options) {
      if (opt.value === val) {
        tenureSelect.value = val;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // Add or select custom option
      tenureSelect.innerHTML = `
        <option value="5">5 Years (60 Months)</option>
        <option value="10">10 Years (120 Months)</option>
        <option value="15">15 Years (180 Months)</option>
        <option value="20">20 Years</option>
        <option value="25">25 Years (300 Months)</option>
        <option value="30">30 Years (360 Months)</option>
        <option value="${val}" selected>${val} ${tenureUnit === 'years' ? 'Years' : 'Months'}</option>
      `;
    }
  }

  // Tenure Unit Toggle (Years vs Months)
  unitYearsBtn.addEventListener('click', () => {
    if (tenureUnit === 'years') return;
    tenureUnit = 'years';
    unitYearsBtn.classList.add('active');
    unitMonthsBtn.classList.remove('active');

    tenureSlider.min = '1';
    tenureSlider.max = '30';
    tenureSlider.step = '1';
    tenureSlider.value = Math.max(1, Math.min(30, Math.round(parseFloat(tenureSlider.value) / 12)));
    tenureMinMaxLabels.innerHTML = '<span>1 Year</span><span>30 Years</span>';
    syncTenureSelect(tenureSlider.value);
    updateSliderFill(tenureSlider);
    calculateEMI();
  });

  unitMonthsBtn.addEventListener('click', () => {
    if (tenureUnit === 'months') return;
    tenureUnit = 'months';
    unitMonthsBtn.classList.add('active');
    unitYearsBtn.classList.remove('active');

    const curYears = parseFloat(tenureSlider.value) || 20;
    tenureSlider.min = '12';
    tenureSlider.max = '360';
    tenureSlider.step = '6';
    tenureSlider.value = curYears * 12;
    tenureMinMaxLabels.innerHTML = '<span>12 Months</span><span>360 Months</span>';
    syncTenureSelect(tenureSlider.value);
    updateSliderFill(tenureSlider);
    calculateEMI();
  });

  // Calculate Button
  btnCalculate.addEventListener('click', () => {
    calculateEMI();
    // Subtle bounce effect
    statMonthlyEmi.style.transform = 'scale(1.06)';
    setTimeout(() => statMonthlyEmi.style.transform = 'scale(1)', 200);
  });

  // Reset Button
  btnReset.addEventListener('click', () => {
    loanAmountInput.value = '50,00,000';
    loanAmountSlider.value = '5000000';

    interestRateInput.value = '8.50';
    interestRateSlider.value = '8.5';

    if (tenureUnit !== 'years') {
      unitYearsBtn.click();
    }
    tenureSlider.value = '20';
    tenureSelect.value = '20';

    updateSliderFill(loanAmountSlider);
    updateSliderFill(interestRateSlider);
    updateSliderFill(tenureSlider);

    calculateEMI();
  });

  // Toggle Schedule Drawer
  btnToggleSchedule.addEventListener('click', () => {
    const isHidden = scheduleDrawer.style.display === 'none';
    scheduleDrawer.style.display = isHidden ? 'block' : 'none';
    btnToggleSchedule.querySelector('span').textContent = isHidden ? 'Hide Amortization Schedule' : 'View Yearly Amortization Schedule';
    btnToggleSchedule.querySelector('svg').style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
  });

  btnCloseSchedule.addEventListener('click', () => {
    scheduleDrawer.style.display = 'none';
    btnToggleSchedule.querySelector('span').textContent = 'View Yearly Amortization Schedule';
    btnToggleSchedule.querySelector('svg').style.transform = 'rotate(0deg)';
  });

  // Initial calculation and slider fill setup
  updateSliderFill(loanAmountSlider);
  updateSliderFill(interestRateSlider);
  updateSliderFill(tenureSlider);
  calculateEMI();
});
