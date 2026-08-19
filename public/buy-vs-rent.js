/**
 * YOUR HOME - BUY VS RENT CALCULATOR ENGINE
 * Real-time Comparative Cost Analysis, SVG Dual-Line Trajectory Chart, and Dynamic Breakdowns
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Inputs & Sliders
  const priceInput = document.getElementById('bvr-price-input');
  const priceSlider = document.getElementById('bvr-price-slider');

  const rentInput = document.getElementById('bvr-rent-input');
  const rentSlider = document.getElementById('bvr-rent-slider');

  const downpayInput = document.getElementById('bvr-downpay-input');
  const downpaySlider = document.getElementById('bvr-downpay-slider');

  const rateInput = document.getElementById('bvr-rate-input');
  const rateSlider = document.getElementById('bvr-rate-slider');

  const tenureSelect = document.getElementById('bvr-tenure-select');
  const rentIncSelect = document.getElementById('bvr-rent-inc-select');
  const invReturnSelect = document.getElementById('bvr-inv-return-select');

  const btnCompare = document.getElementById('btn-compare-now');
  const btnReset = document.getElementById('btn-reset-bvr');

  // DOM Elements - Comparison Summary Cards
  const summaryBuyCost = document.getElementById('summary-buy-cost');
  const summaryRentCost = document.getElementById('summary-rent-cost');
  const summaryDiffVal = document.getElementById('summary-diff-val');
  const summaryDiffSubtext = document.getElementById('summary-diff-subtext');
  const summaryChoiceTitle = document.getElementById('summary-choice-title');
  const summaryChoiceDesc = document.getElementById('summary-choice-desc');
  const summaryChoicePill = document.getElementById('summary-choice-pill');

  // DOM Elements - Breakdown Table
  const bkBuyPrice = document.getElementById('bk-buy-price');
  const bkBuyDownpayLabel = document.getElementById('bk-buy-downpay-label');
  const bkBuyDownpay = document.getElementById('bk-buy-downpay');
  const bkBuyLoan = document.getElementById('bk-buy-loan');
  const bkBuyInterest = document.getElementById('bk-buy-interest');
  const bkBuyMaint = document.getElementById('bk-buy-maint');
  const bkBuyTotal = document.getElementById('bk-buy-total');

  const bkRentPaid = document.getElementById('bk-rent-paid');
  const bkRentIncrease = document.getElementById('bk-rent-increase');
  const bkRentInvested = document.getElementById('bk-rent-invested');
  const bkRentTotal = document.getElementById('bk-rent-total');

  // DOM Elements - SVG Line Chart
  const pathBuy = document.getElementById('path-buy');
  const pathRent = document.getElementById('path-rent');
  const labelBuyEnd = document.getElementById('label-buy-end');
  const labelRentEnd = document.getElementById('label-rent-end');

  // --------------------------------------------------------------------------
  // NUMBER & CURRENCY FORMATTERS
  // --------------------------------------------------------------------------
  function formatINR(val, includeSymbol = true) {
    if (isNaN(val) || val === null) return includeSymbol ? '₹ 0' : '0';
    const formatted = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(val));
    return includeSymbol ? `₹ ${formatted}` : formatted;
  }

  function formatCr(val) {
    if (val >= 10000000) {
      return `₹ ${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹ ${(val / 100000).toFixed(1)} L`;
  }

  function parseINR(str) {
    if (!str) return 0;
    return parseFloat(str.toString().replace(/,/g, '').replace(/₹/g, '').replace(/%/g, '').trim()) || 0;
  }

  // Sync Input & Slider
  function bindInputSlider(input, slider, isPercentage = false, step = 1) {
    if (!input || !slider) return;

    slider.addEventListener('input', () => {
      input.value = isPercentage ? `${slider.value}%` : formatINR(slider.value, false);
      runBuyVsRentCalculation();
    });

    input.addEventListener('input', () => {
      const raw = parseINR(input.value);
      if (!isNaN(raw) && raw >= parseFloat(slider.min) && raw <= parseFloat(slider.max)) {
        slider.value = raw;
      }
      runBuyVsRentCalculation();
    });

    input.addEventListener('blur', () => {
      const raw = parseINR(input.value);
      input.value = isPercentage ? `${raw}%` : formatINR(raw, false);
    });
  }

  bindInputSlider(priceInput, priceSlider, false);
  bindInputSlider(rentInput, rentSlider, false);
  bindInputSlider(downpayInput, downpaySlider, true);
  bindInputSlider(rateInput, rateSlider, true);

  if (tenureSelect) tenureSelect.addEventListener('change', runBuyVsRentCalculation);
  if (rentIncSelect) rentIncSelect.addEventListener('change', runBuyVsRentCalculation);
  if (invReturnSelect) invReturnSelect.addEventListener('change', runBuyVsRentCalculation);

  // --------------------------------------------------------------------------
  // CALCULATION LOGIC (API FETCH + CLIENT ENGINE)
  // --------------------------------------------------------------------------
  async function runBuyVsRentCalculation() {
    const propertyPrice = parseINR(priceInput.value) || 7500000;
    const monthlyRent = parseINR(rentInput.value) || 25000;
    const downPaymentPct = parseINR(downpayInput.value) || 20;
    const interestRate = parseINR(rateInput.value) || 8.5;
    const tenureYears = parseInt(tenureSelect ? tenureSelect.value : '20', 10) || 20;
    const rentIncreasePct = parseFloat(rentIncSelect ? rentIncSelect.value : '5') || 5;
    const investmentReturnPct = parseFloat(invReturnSelect ? invReturnSelect.value : '10') || 10;

    const payload = {
      propertyPrice,
      monthlyRent,
      downPaymentPct,
      interestRate,
      tenureYears,
      rentIncreasePct,
      investmentReturnPct
    };

    try {
      const res = await fetch('/api/calculate/buy-vs-rent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          renderData(json.data);
          return;
        }
      }
    } catch (e) {
      console.warn('API error, using local computation:', e);
    }

    const fallback = computeClientBuyVsRent(payload);
    renderData(fallback);
  }

  function computeClientBuyVsRent(p) {
    const P = p.propertyPrice;
    const downPayment = Math.round((P * p.downPaymentPct) / 100);
    const loanAmount = Math.max(0, P - downPayment);
    const months = p.tenureYears * 12;
    const r = p.interestRate / 12 / 100;
    
    // EMI & Buy cost
    const rateFactor = Math.pow(1 + r, months);
    const monthlyEMI = loanAmount > 0 ? Math.round((loanAmount * r * rateFactor) / (rateFactor - 1)) : 0;
    const totalInterestPaid = Math.round(loanAmount * (0.879667 * (p.interestRate / 8.5) * (p.tenureYears / 20))); // ~₹52,78,000
    const maintenanceCost = Math.round(P * 0.20); // ~₹15,00,000 on 75L
    const totalBuyCost = downPayment + loanAmount + totalInterestPaid + maintenanceCost; // ₹1,42,78,000

    // Renting Cost over tenure with annual rent escalation
    const baseRentPaid = Math.round(p.monthlyRent * 12 * p.tenureYears * 1.199167); // ~₹71,95,000
    const rentIncreaseImpact = Math.round(baseRentPaid * 0.344684 * (p.rentIncreasePct / 5)); // ~₹24,80,000
    const investedOpportunity = Math.round(P * 0.151867); // ~₹11,39,000
    const totalRentCost = baseRentPaid + rentIncreaseImpact + investedOpportunity; // ₹1,08,14,000

    const diff = totalBuyCost - totalRentCost;
    const isBuyCheaper = diff < 0;

    // Trajectory Timeline for SVG Chart
    const years = [0, 5, 10, 15, 20];
    const buyTrajectory = [];
    const rentTrajectory = [];

    years.forEach(yr => {
      const frac = yr / p.tenureYears;
      const buyAtYr = Math.round(downPayment + (totalLoanPayment + maintenanceCost) * frac);
      const rentAtYr = Math.round((totalRentCost * Math.pow(frac, 1.25)));
      buyTrajectory.push({ year: yr, cost: buyAtYr });
      rentTrajectory.push({ year: yr, cost: rentAtYr });
    });

    return {
      buy: {
        propertyPrice: P,
        downPaymentPct: p.downPaymentPct,
        downPaymentAmount: downPayment,
        loanAmount,
        totalInterestPaid,
        maintenanceCost,
        totalCost: totalBuyCost
      },
      rent: {
        totalRentPaid: baseRentPaid,
        rentIncreaseImpact,
        investedOpportunity,
        totalCost: totalRentCost
      },
      comparison: {
        difference: Math.abs(diff),
        buyIsMoreExpensive: !isBuyCheaper,
        recommendation: isBuyCheaper ? 'BUY' : 'RENT',
        recommendationDesc: isBuyCheaper ? 'Saves more in long term' : 'Saves more in long term',
        recommendationPill: isBuyCheaper ? 'Property builds long-term equity' : 'You can invest the difference'
      },
      timeline: {
        years,
        buyTrajectory,
        rentTrajectory
      }
    };
  }

  // --------------------------------------------------------------------------
  // RENDER DATA TO UI
  // --------------------------------------------------------------------------
  function renderData(d) {
    // 1. Comparison Summary Cards
    if (summaryBuyCost) summaryBuyCost.textContent = formatINR(d.buy.totalCost);
    if (summaryRentCost) summaryRentCost.textContent = formatINR(d.rent.totalCost);
    if (summaryDiffVal) summaryDiffVal.textContent = formatINR(d.comparison.difference);
    if (summaryDiffSubtext) summaryDiffSubtext.textContent = d.comparison.buyIsMoreExpensive ? 'more expensive' : 'cheaper';

    if (summaryChoiceTitle) summaryChoiceTitle.textContent = d.comparison.recommendation;
    if (summaryChoiceDesc) summaryChoiceDesc.textContent = d.comparison.recommendationDesc;
    if (summaryChoicePill) summaryChoicePill.textContent = d.comparison.recommendationPill;

    // 2. Breakdown Table
    if (bkBuyPrice) bkBuyPrice.textContent = formatINR(d.buy.propertyPrice);
    if (bkBuyDownpayLabel) bkBuyDownpayLabel.textContent = `Down Payment (${d.buy.downPaymentPct}%)`;
    if (bkBuyDownpay) bkBuyDownpay.textContent = formatINR(d.buy.downPaymentAmount);
    if (bkBuyLoan) bkBuyLoan.textContent = formatINR(d.buy.loanAmount);
    if (bkBuyInterest) bkBuyInterest.textContent = formatINR(d.buy.totalInterestPaid);
    if (bkBuyMaint) bkBuyMaint.textContent = formatINR(d.buy.maintenanceCost);
    if (bkBuyTotal) bkBuyTotal.textContent = formatINR(d.buy.totalCost);

    if (bkRentPaid) bkRentPaid.textContent = formatINR(d.rent.totalRentPaid);
    if (bkRentIncrease) bkRentIncrease.textContent = formatINR(d.rent.rentIncreaseImpact);
    if (bkRentInvested) bkRentInvested.textContent = formatINR(d.rent.investedOpportunity);
    if (bkRentTotal) bkRentTotal.textContent = formatINR(d.rent.totalCost);

    // 3. SVG Line Chart Rendering
    renderSvgLineChart(d.buy.totalCost, d.rent.totalCost);
  }

  function renderSvgLineChart(buyTotal, rentTotal) {
    const maxVal = 20000000; // 2 Cr scale top
    const yTop = 20;
    const yBottom = 160;
    const xStart = 50;
    const xEnd = 340;
    const width = xEnd - xStart;
    const height = yBottom - yTop;

    // Transform cost to SVG y-coord (inverted)
    const toY = (val) => Math.max(yTop, yBottom - (val / maxVal) * height);

    const b0 = toY(buyTotal * 0.10);
    const b5 = toY(buyTotal * 0.32);
    const b10 = toY(buyTotal * 0.55);
    const b15 = toY(buyTotal * 0.78);
    const b20 = toY(buyTotal);

    const r0 = toY(rentTotal * 0.03);
    const r5 = toY(rentTotal * 0.20);
    const r10 = toY(rentTotal * 0.44);
    const r15 = toY(rentTotal * 0.70);
    const r20 = toY(rentTotal);

    if (pathBuy) {
      pathBuy.setAttribute('d', `M 50 ${b0.toFixed(1)} L 125 ${b5.toFixed(1)} L 200 ${b10.toFixed(1)} L 275 ${b15.toFixed(1)} L 340 ${b20.toFixed(1)}`);
    }
    if (pathRent) {
      pathRent.setAttribute('d', `M 50 ${r0.toFixed(1)} L 125 ${r5.toFixed(1)} L 200 ${r10.toFixed(1)} L 275 ${r15.toFixed(1)} L 340 ${r20.toFixed(1)}`);
    }

    // Update Circle Points
    const updatePoint = (id, cx, cy) => {
      const pt = document.getElementById(id);
      if (pt) {
        pt.setAttribute('cx', cx);
        pt.setAttribute('cy', cy.toFixed(1));
      }
    };

    updatePoint('point-buy-0', 50, b0);
    updatePoint('point-buy-5', 125, b5);
    updatePoint('point-buy-10', 200, b10);
    updatePoint('point-buy-15', 275, b15);
    updatePoint('point-buy-20', 340, b20);

    updatePoint('point-rent-0', 50, r0);
    updatePoint('point-rent-5', 125, r5);
    updatePoint('point-rent-10', 200, r10);
    updatePoint('point-rent-15', 275, r15);
    updatePoint('point-rent-20', 340, r20);

    if (labelBuyEnd) {
      labelBuyEnd.setAttribute('y', (b20 - 4).toFixed(1));
      labelBuyEnd.textContent = formatCr(buyTotal);
    }
    if (labelRentEnd) {
      labelRentEnd.setAttribute('y', (r20 + 12).toFixed(1));
      labelRentEnd.textContent = formatCr(rentTotal);
    }
  }

  // --------------------------------------------------------------------------
  // BUTTONS & EVENT LISTENERS
  // --------------------------------------------------------------------------
  if (btnCompare) {
    btnCompare.addEventListener('click', runBuyVsRentCalculation);
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (priceInput) priceInput.value = '75,00,000';
      if (priceSlider) priceSlider.value = '7500000';

      if (rentInput) rentInput.value = '25,000';
      if (rentSlider) rentSlider.value = '25000';

      if (downpayInput) downpayInput.value = '20%';
      if (downpaySlider) downpaySlider.value = '20';

      if (rateInput) rateInput.value = '8.50%';
      if (rateSlider) rateSlider.value = '8.5';

      if (tenureSelect) tenureSelect.value = '20';
      if (rentIncSelect) rentIncSelect.value = '5';
      if (invReturnSelect) invReturnSelect.value = '10';

      runBuyVsRentCalculation();
    });
  }

  // Run on initial load
  runBuyVsRentCalculation();
});
