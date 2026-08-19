/**
 * YOUR HOME - TRUE COST CALCULATOR ENGINE
 * Real-time Indian Real Estate Tax Calculation, Currency Formatter, & SVG Donut Chart Slicing
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Inputs
  const propPriceInput = document.getElementById('prop-price-input');
  const propPriceSlider = document.getElementById('prop-price-slider');
  const propLocationSelect = document.getElementById('prop-location-select');
  const carpetAreaInput = document.getElementById('carpet-area-input');
  const buyerCategorySelect = document.getElementById('buyer-category-select');
  const typePillButtons = document.querySelectorAll('.type-pill');

  // DOM Elements - Buttons
  const btnCalcTrueCost = document.getElementById('btn-calc-true-cost');
  const btnResetTrueCost = document.getElementById('btn-reset-true-cost');

  // DOM Elements - Top Metric Displays
  const statTotalTrueCost = document.getElementById('stat-total-true-cost');
  const statEffectiveRate = document.getElementById('stat-effective-rate');
  const statBasePrice = document.getElementById('stat-base-price');
  const statAdditionalCost = document.getElementById('stat-additional-cost');
  const statAdditionalPct = document.getElementById('stat-additional-pct');

  // DOM Elements - Cost Breakup Table
  const rowBaseAmount = document.getElementById('row-base-amount');
  const rowBasePct = document.getElementById('row-base-pct');
  const rowStampAmount = document.getElementById('row-stamp-amount');
  const rowStampPct = document.getElementById('row-stamp-pct');
  const rowRegAmount = document.getElementById('row-reg-amount');
  const rowRegPct = document.getElementById('row-reg-pct');
  const rowGstAmount = document.getElementById('row-gst-amount');
  const rowGstPct = document.getElementById('row-gst-pct');
  const rowOtherAmount = document.getElementById('row-other-amount');
  const rowOtherPct = document.getElementById('row-other-pct');
  const rowTotalAmount = document.getElementById('row-total-amount');
  const rowTotalPct = document.getElementById('row-total-pct');

  // DOM Elements - Donut Chart & Legend
  const chartCenterTotalVal = document.getElementById('chart-center-total-val');
  const sliceBase = document.getElementById('slice-base');
  const sliceStamp = document.getElementById('slice-stamp');
  const sliceReg = document.getElementById('slice-reg');
  const sliceGst = document.getElementById('slice-gst');
  const sliceOther = document.getElementById('slice-other');

  const legBasePct = document.getElementById('leg-base-pct');
  const legGstPct = document.getElementById('leg-gst-pct');
  const legStampPct = document.getElementById('leg-stamp-pct');
  const legOtherPct = document.getElementById('leg-other-pct');
  const legRegPct = document.getElementById('leg-reg-pct');

  // SVG Donut Circumference for r=58
  const CIRCLE_RADIUS = 58;
  const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS; // ~364.4247

  // State Variables
  let selectedPropertyType = 'residential'; // 'residential' | 'commercial' | 'land'

  // Location Benchmarks
  const TAX_BENCHMARKS = {
    'delhi': {
      stampDuty: { general: 6.0, female: 4.0, senior: 6.0 },
      regRate: 1.0,
      gst: { residential: 5.0, commercial: 12.0, land: 0.0 },
      otherPct: 0.76 // ₹38k on 50L
    },
    'mumbai': {
      stampDuty: { general: 6.0, female: 5.0, senior: 6.0 },
      regRate: 1.0,
      gst: { residential: 5.0, commercial: 12.0, land: 0.0 },
      otherPct: 0.8
    },
    'bengaluru': {
      stampDuty: { general: 5.0, female: 5.0, senior: 5.0 },
      regRate: 1.0,
      gst: { residential: 5.0, commercial: 12.0, land: 0.0 },
      otherPct: 0.75
    },
    'hyderabad': {
      stampDuty: { general: 6.0, female: 6.0, senior: 6.0 },
      regRate: 0.5,
      gst: { residential: 5.0, commercial: 12.0, land: 0.0 },
      otherPct: 0.7
    },
    'chennai': {
      stampDuty: { general: 7.0, female: 7.0, senior: 7.0 },
      regRate: 2.0,
      gst: { residential: 5.0, commercial: 12.0, land: 0.0 },
      otherPct: 0.85
    },
    'pune': {
      stampDuty: { general: 6.0, female: 5.0, senior: 6.0 },
      regRate: 1.0,
      gst: { residential: 5.0, commercial: 12.0, land: 0.0 },
      otherPct: 0.78
    },
    'kolkata': {
      stampDuty: { general: 6.0, female: 6.0, senior: 6.0 },
      regRate: 1.0,
      gst: { residential: 5.0, commercial: 12.0, land: 0.0 },
      otherPct: 0.75
    }
  };

  // --------------------------------------------------------------------------
  // UTILITY: Indian Currency Formatter (₹ 50,00,000)
  // --------------------------------------------------------------------------
  function formatINR(val, withSymbol = true) {
    if (isNaN(val) || val === null) return withSymbol ? '₹ 0' : '0';
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(Math.round(val));
    return withSymbol ? `₹ ${formatted}` : formatted;
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
  function calculateTrueCost() {
    const basePrice = parseINR(propPriceInput.value) || 5000000;
    const locKey = propLocationSelect.value || 'delhi';
    const config = TAX_BENCHMARKS[locKey] || TAX_BENCHMARKS['delhi'];
    const carpetArea = Math.max(1, parseFloat(carpetAreaInput.value) || 1200);
    const buyerCategory = buyerCategorySelect.value || 'general';

    // 1. Stamp Duty
    let stampRate = config.stampDuty[buyerCategory] !== undefined ? config.stampDuty[buyerCategory] : 6.0;
    const stampDuty = Math.round((basePrice * stampRate) / 100);

    // 2. Registration Charges (1% standard)
    const regRate = config.regRate || 1.0;
    const registrationCharges = Math.round((basePrice * regRate) / 100);

    // 3. GST (Residential 5%, Commercial 12%, Land 0%)
    let gstRate = config.gst[selectedPropertyType] !== undefined ? config.gst[selectedPropertyType] : 5.0;
    const gst = Math.round((basePrice * gstRate) / 100);

    // 4. Other Charges (Legal, Electricity, Maintenance deposit ~ 0.76% default)
    const otherCharges = Math.round((basePrice * config.otherPct) / 100);

    // 5. Total Additional & True Cost
    const totalAdditionalCost = stampDuty + registrationCharges + gst + otherCharges;
    const totalTrueCost = basePrice + totalAdditionalCost;
    const effectivePricePerSqFt = Math.round(totalTrueCost / carpetArea);
    const additionalCostPct = Number(((totalAdditionalCost / basePrice) * 100).toFixed(2));

    // Percentages of Total True Cost
    const basePricePct = Number(((basePrice / totalTrueCost) * 100).toFixed(2));
    const stampDutyPct = Number(((stampDuty / totalTrueCost) * 100).toFixed(2));
    const regChargesPct = Number(((registrationCharges / totalTrueCost) * 100).toFixed(2));
    const gstPct = Number(((gst / totalTrueCost) * 100).toFixed(2));
    const otherChargesPct = Number(((otherCharges / totalTrueCost) * 100).toFixed(2));

    // Update Top Metric Stat Cards
    statTotalTrueCost.textContent = formatINR(totalTrueCost);
    statEffectiveRate.textContent = formatINR(effectivePricePerSqFt);
    statBasePrice.textContent = formatINR(basePrice);
    statAdditionalCost.textContent = formatINR(totalAdditionalCost);
    statAdditionalPct.textContent = `${additionalCostPct}%`;

    // Update Cost Breakup Table
    rowBaseAmount.textContent = formatINR(basePrice);
    rowBasePct.textContent = `${basePricePct}%`;

    rowStampAmount.textContent = formatINR(stampDuty);
    rowStampPct.textContent = `${stampDutyPct}%`;

    rowRegAmount.textContent = formatINR(registrationCharges);
    rowRegPct.textContent = `${regChargesPct}%`;

    rowGstAmount.textContent = formatINR(gst);
    rowGstPct.textContent = `${gstPct}%`;

    rowOtherAmount.textContent = formatINR(otherCharges);
    rowOtherPct.textContent = `${otherChargesPct}%`;

    rowTotalAmount.textContent = formatINR(totalTrueCost);
    rowTotalPct.textContent = '100%';

    // Update Chart Center Readout
    chartCenterTotalVal.textContent = formatINR(totalTrueCost);

    // Update Legend Percentages
    legBasePct.textContent = `${basePricePct}%`;
    legStampPct.textContent = `${stampDutyPct}%`;
    legRegPct.textContent = `${regChargesPct}%`;
    legGstPct.textContent = `${gstPct}%`;
    legOtherPct.textContent = `${otherChargesPct}%`;

    // ------------------------------------------------------------------------
    // SVG DONUT SLICES SEGMENTATION
    // ------------------------------------------------------------------------
    updateDonutSegments([
      { el: sliceBase, pct: basePricePct },
      { el: sliceStamp, pct: stampDutyPct },
      { el: sliceReg, pct: regChargesPct },
      { el: sliceGst, pct: gstPct },
      { el: sliceOther, pct: otherChargesPct }
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
  // EVENT LISTENERS & SYNCHRONIZATION
  // --------------------------------------------------------------------------

  // Property Price Input & Slider Sync
  propPriceSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    propPriceInput.value = formatINR(val, false);
    updateSliderFill(propPriceSlider);
    calculateTrueCost();
  });

  propPriceInput.addEventListener('input', (e) => {
    let raw = parseINR(e.target.value);
    if (isNaN(raw)) raw = 0;
    if (raw > 50000000) raw = 50000000;
    propPriceSlider.value = raw;
    updateSliderFill(propPriceSlider);
    calculateTrueCost();
  });

  propPriceInput.addEventListener('blur', () => {
    let raw = parseINR(propPriceInput.value);
    if (raw < 1000000) raw = 1000000;
    if (raw > 50000000) raw = 50000000;
    propPriceInput.value = formatINR(raw, false);
    propPriceSlider.value = raw;
    updateSliderFill(propPriceSlider);
    calculateTrueCost();
  });

  // Location Dropdown Change
  propLocationSelect.addEventListener('change', () => {
    calculateTrueCost();
  });

  // Buyer Category Change
  buyerCategorySelect.addEventListener('change', () => {
    calculateTrueCost();
  });

  // Carpet Area Change
  carpetAreaInput.addEventListener('input', () => {
    calculateTrueCost();
  });

  // Property Type Pills
  typePillButtons.forEach((pill) => {
    pill.addEventListener('click', () => {
      typePillButtons.forEach((p) => {
        p.classList.remove('active');
        p.setAttribute('aria-checked', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-checked', 'true');
      selectedPropertyType = pill.getAttribute('data-type') || 'residential';
      calculateTrueCost();
    });
  });

  // Action Buttons
  btnCalcTrueCost.addEventListener('click', () => {
    calculateTrueCost();
    // Subtle smooth scroll into view on small screens
    if (window.innerWidth <= 1024) {
      document.querySelector('.results-summary-panel').scrollIntoView({ behavior: 'smooth' });
    }
  });

  btnResetTrueCost.addEventListener('click', () => {
    // Reset to screenshot default benchmark values
    propPriceInput.value = '50,00,000';
    propPriceSlider.value = '5000000';
    propLocationSelect.value = 'delhi';
    carpetAreaInput.value = '1200';
    buyerCategorySelect.value = 'general';

    typePillButtons.forEach((p) => {
      p.classList.remove('active');
      p.setAttribute('aria-checked', 'false');
    });
    const defaultPill = document.querySelector('.type-pill[data-type="residential"]');
    if (defaultPill) {
      defaultPill.classList.add('active');
      defaultPill.setAttribute('aria-checked', 'true');
    }
    selectedPropertyType = 'residential';

    updateSliderFill(propPriceSlider);
    calculateTrueCost();
  });

  // --------------------------------------------------------------------------
  // INITIALIZE ON LOAD
  // --------------------------------------------------------------------------
  updateSliderFill(propPriceSlider);
  calculateTrueCost();
});
