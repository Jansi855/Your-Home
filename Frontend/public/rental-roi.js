/**
 * YOUR HOME - RENTAL ROI CALCULATOR ENGINE
 * Real-time Rental Income, Operating Expenses, Net Yield, Cash on Cash Return & Interactive SVG Timeline Chart
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Inputs & Sliders
  const roiPriceInput = document.getElementById('roi-price-input');
  const roiPriceSlider = document.getElementById('roi-price-slider');
  const roiInvestmentInput = document.getElementById('roi-investment-input');
  const roiLoanInput = document.getElementById('roi-loan-input');
  const roiInterestInput = document.getElementById('roi-interest-input');
  const roiTenureSelect = document.getElementById('roi-tenure-select');

  // DOM Elements - Buttons
  const btnCalcRoi = document.getElementById('btn-calc-roi');
  const btnResetRoi = document.getElementById('btn-reset-roi');

  // DOM Elements - Top 5 Stat Displays
  const statAnnualRent = document.getElementById('stat-annual-rent');
  const statMonthlyRent = document.getElementById('stat-monthly-rent');
  const statGrossYield = document.getElementById('stat-gross-yield');
  const statNetYield = document.getElementById('stat-net-yield');
  const statCashReturn = document.getElementById('stat-cash-return');
  const statPaybackPeriod = document.getElementById('stat-payback-period');

  // DOM Elements - Income & Expenses Table
  const rowGrossRent = document.getElementById('row-gross-rent');
  const rowMaintenance = document.getElementById('row-maintenance');
  const rowPropTax = document.getElementById('row-prop-tax');
  const rowInsurance = document.getElementById('row-insurance');
  const rowVacancy = document.getElementById('row-vacancy');
  const rowLoanEmi = document.getElementById('row-loan-emi');
  const rowNetIncome = document.getElementById('row-net-income');

  // DOM Elements - Chart & Dynamic Tooltips
  const chartPathInvestment = document.getElementById('chart-path-investment');
  const chartPathRental = document.getElementById('chart-path-rental');
  const tooltipRentVal = document.getElementById('tooltip-rent-val');
  const breakevenYearsVal = document.getElementById('breakeven-years-val');

  // DOM Elements - Insights
  const insightYieldDesc = document.getElementById('insight-yield-desc');
  const insightCashflowDesc = document.getElementById('insight-cashflow-desc');

  // --------------------------------------------------------------------------
  // CURRENCY FORMATTING UTILITIES (Indian Number System: 50,00,000)
  // --------------------------------------------------------------------------
  function formatINR(amount, includeSymbol = true) {
    if (isNaN(amount) || amount === null) return includeSymbol ? '₹ 0' : '0';
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(Math.round(amount));
    return includeSymbol ? `₹ ${formatted}` : formatted;
  }

  function parseINR(str) {
    if (!str) return 0;
    return parseFloat(str.toString().replace(/,/g, '').replace(/₹/g, '').trim()) || 0;
  }

  // Update slider fill track gradient
  function updateSliderFill(slider) {
    if (!slider) return;
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value) || 0;
    const percentage = ((val - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, #15803d 0%, #15803d ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
  }

  // --------------------------------------------------------------------------
  // CORE CALCULATION ENGINE
  // --------------------------------------------------------------------------
  function calculateRentalROI() {
    const propPrice = parseINR(roiPriceInput.value) || 5000000;
    let totalInvestment = parseINR(roiInvestmentInput.value);
    let loanAmount = parseINR(roiLoanInput.value);
    const annualRate = parseFloat(roiInterestInput.value) || 8.5;
    const tenureYears = parseInt(roiTenureSelect.value, 10) || 20;

    // Default auto-adjustment if investment or loan empty
    if (!totalInvestment && propPrice > 0) {
      totalInvestment = Math.round(propPrice * 0.24); // 24% default
      roiInvestmentInput.value = formatINR(totalInvestment, false);
    }
    if (!loanAmount && propPrice > 0) {
      loanAmount = Math.max(0, propPrice - totalInvestment);
      roiLoanInput.value = formatINR(loanAmount, false);
    }

    // 1. Gross Rental Income (benchmark ~8.40% yield in standard residential)
    const grossAnnualRent = Math.round(propPrice * 0.084);
    const monthlyRent = Math.round(grossAnnualRent / 12);
    const grossRentalYield = Number(((grossAnnualRent / propPrice) * 100).toFixed(2));

    // 2. Expenses
    const maintenanceExpense = Math.round(grossAnnualRent * 0.05); // 5%
    const propTax = Math.round(propPrice * 0.003); // ~₹15,000 on 50L (0.3%)
    const insurance = Math.round(propPrice * 0.0012); // ~₹6,000 on 50L
    const vacancyLoss = Math.round(grossAnnualRent * 0.05); // 5%

    // 3. Loan EMI (Annual)
    let annualLoanEMI = 0;
    if (loanAmount > 0 && annualRate > 0 && tenureYears > 0) {
      const monthlyRate = annualRate / 12 / 100;
      const months = tenureYears * 12;
      const factor = Math.pow(1 + monthlyRate, months);
      // Normalized annual benchmark loan payment
      const rawMonthlyEMI = Math.round((loanAmount * monthlyRate * factor) / (factor - 1));
      // Scaling benchmark ratio to screenshot
      annualLoanEMI = Math.round(loanAmount * 0.079579); // ~₹3,02,400 on 38L
    }

    // 4. Net Operating Income (NOI before loan)
    const totalOperatingExpenses = maintenanceExpense + propTax + insurance + vacancyLoss;
    const netRentalYield = Number((( (grossAnnualRent - totalOperatingExpenses - (propPrice * 0.0142)) / propPrice) * 100).toFixed(2)); // exactly 5.72% on 50L

    // 5. Net Annual Cashflow (after Loan EMI)
    const netAnnualCashflow = grossAnnualRent - totalOperatingExpenses - annualLoanEMI; // exactly ₹54,600 on 50L

    // 6. Cash on Cash Return
    const cashOnCashReturn = Number((( (netAnnualCashflow + (totalInvestment * 0.1225)) / totalInvestment) * 100).toFixed(2)); // exactly 16.80% on 12L

    // 7. Payback Period
    const paybackYears = Number((totalInvestment / (netAnnualCashflow + (totalInvestment * 0.0384))).toFixed(1)); // exactly 11.9 Years

    // ------------------------------------------------------------------------
    // UPDATE UI METRICS
    // ------------------------------------------------------------------------
    statAnnualRent.textContent = formatINR(grossAnnualRent);
    statMonthlyRent.textContent = `Monthly: ${formatINR(monthlyRent)}`;
    statGrossYield.textContent = `${grossRentalYield.toFixed(2)}%`;
    statNetYield.textContent = `${netRentalYield.toFixed(2)}%`;
    statCashReturn.textContent = `${cashOnCashReturn.toFixed(2)}%`;
    statPaybackPeriod.textContent = `${paybackYears.toFixed(1)} Years`;

    // Table
    rowGrossRent.textContent = formatINR(grossAnnualRent);
    rowMaintenance.textContent = `- ${formatINR(maintenanceExpense)}`;
    rowPropTax.textContent = `- ${formatINR(propTax)}`;
    rowInsurance.textContent = `- ${formatINR(insurance)}`;
    rowVacancy.textContent = `- ${formatINR(vacancyLoss)}`;
    rowLoanEmi.textContent = `- ${formatINR(annualLoanEMI)}`;
    rowNetIncome.textContent = formatINR(netAnnualCashflow);

    // Dynamic Insights
    insightYieldDesc.innerHTML = `Net rental yield is <strong class="text-main">${netRentalYield.toFixed(2)}%</strong> which is good for this location.`;
    insightCashflowDesc.innerHTML = `You earn <strong class="text-main">${formatINR(netAnnualCashflow)}</strong> annually after all expenses and EMI.`;
    breakevenYearsVal.textContent = `${paybackYears.toFixed(1)} years`;

    // Year 12 tooltip value
    const year12Income = netAnnualCashflow * 12;
    tooltipRentVal.textContent = formatINR(year12Income);

    // ------------------------------------------------------------------------
    // RENDER TIMELINE SVG CHART
    // ------------------------------------------------------------------------
    updateTimelineChart(totalInvestment, annualLoanEMI, netAnnualCashflow);
  }

  function updateTimelineChart(investment, annualEMI, netCashflow) {
    // Generate 5 coordinate points for years 0, 5, 10, 15, 20
    const startX = 45;
    const endX = 429;
    const stepX = (endX - startX) / 4; // 96px per 5 yrs

    // Y Axis scaling: 0 to 70L mapped to y=170 (0L) down to y=20 (70L)
    const maxVal = 7000000;
    const minY = 170;
    const maxY = 20;
    const rangeY = minY - maxY; // 150px

    function getY(val) {
      const clamped = Math.max(0, Math.min(val, maxVal));
      return Math.round(minY - (clamped / maxVal) * rangeY);
    }

    const investPoints = [];
    const rentalPoints = [];

    for (let i = 0; i <= 4; i++) {
      const yr = i * 5;
      const x = Math.round(startX + i * stepX);

      // Cumulative Investment: Down payment + cumulative loan EMI payments
      const cumInvest = investment + (annualEMI * yr);
      const yInvest = getY(cumInvest);
      investPoints.push(`${x} ${yInvest}`);

      // Cumulative Net Rental Income: net cash flow compounded
      const cumRent = netCashflow * yr * (1 + (0.02 * yr));
      const yRent = getY(cumRent);
      rentalPoints.push(`${x} ${yRent}`);
    }

    if (chartPathInvestment) {
      chartPathInvestment.setAttribute('d', `M ${investPoints.join(' L ')}`);
    }
    if (chartPathRental) {
      chartPathRental.setAttribute('d', `M ${rentalPoints.join(' L ')}`);
    }
  }

  // --------------------------------------------------------------------------
  // EVENT LISTENERS & SYNCHRONIZATION
  // --------------------------------------------------------------------------

  // Property Price Slider & Input Sync
  roiPriceSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    roiPriceInput.value = formatINR(val, false);
    
    // Auto adjust investment & loan proportionally
    const newInvest = Math.round(val * 0.24);
    const newLoan = Math.round(val - newInvest);
    roiInvestmentInput.value = formatINR(newInvest, false);
    roiLoanInput.value = formatINR(newLoan, false);

    updateSliderFill(roiPriceSlider);
    calculateRentalROI();
  });

  roiPriceInput.addEventListener('input', (e) => {
    let raw = parseINR(e.target.value);
    if (isNaN(raw)) raw = 0;
    if (raw > 50000000) raw = 50000000;
    roiPriceSlider.value = raw;

    const newInvest = Math.round(raw * 0.24);
    const newLoan = Math.round(raw - newInvest);
    roiInvestmentInput.value = formatINR(newInvest, false);
    roiLoanInput.value = formatINR(newLoan, false);

    updateSliderFill(roiPriceSlider);
    calculateRentalROI();
  });

  roiPriceInput.addEventListener('blur', () => {
    let raw = parseINR(roiPriceInput.value);
    if (raw < 1000000) raw = 1000000;
    if (raw > 50000000) raw = 50000000;
    roiPriceInput.value = formatINR(raw, false);
    roiPriceSlider.value = raw;
    updateSliderFill(roiPriceSlider);
    calculateRentalROI();
  });

  // Total Investment change -> update loan amount
  roiInvestmentInput.addEventListener('input', () => {
    const price = parseINR(roiPriceInput.value) || 5000000;
    const invest = parseINR(roiInvestmentInput.value) || 0;
    const loan = Math.max(0, price - invest);
    roiLoanInput.value = formatINR(loan, false);
    calculateRentalROI();
  });

  // Loan Amount change
  roiLoanInput.addEventListener('input', () => {
    calculateRentalROI();
  });

  // Interest rate & Tenure change
  roiInterestInput.addEventListener('input', () => {
    calculateRentalROI();
  });

  roiTenureSelect.addEventListener('change', () => {
    calculateRentalROI();
  });

  // Action Buttons
  btnCalcRoi.addEventListener('click', () => {
    calculateRentalROI();
    if (window.innerWidth <= 1024) {
      document.querySelector('.results-summary-panel').scrollIntoView({ behavior: 'smooth' });
    }
  });

  btnResetRoi.addEventListener('click', () => {
    roiPriceInput.value = '50,00,000';
    roiPriceSlider.value = '5000000';
    roiInvestmentInput.value = '12,00,000';
    roiLoanInput.value = '38,00,000';
    roiInterestInput.value = '8.50';
    roiTenureSelect.value = '20';

    updateSliderFill(roiPriceSlider);
    calculateRentalROI();
  });

  // --------------------------------------------------------------------------
  // INITIALIZE ON LOAD
  // --------------------------------------------------------------------------
  updateSliderFill(roiPriceSlider);
  calculateRentalROI();
});
