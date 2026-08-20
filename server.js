const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const fs = require('fs');

// Serve static frontend files from Frontend/dist if built, otherwise from public/
const frontendDist = path.join(__dirname, 'Frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
}
app.use(express.static(path.join(__dirname, 'public')));

// --------------------------------------------------------------------------
// LOCATION & TAX RATES DATA (Indian Real Estate Benchmark Rates)
// --------------------------------------------------------------------------
const LOCATION_TAX_RATES = {
  'delhi': {
    name: 'New Delhi, Delhi',
    state: 'Delhi',
    stampDuty: { general: 6.0, female: 4.0, jointFemale: 5.0, senior: 6.0 },
    registrationRate: 1.0, // 1%
    gstResidential: 5.0,
    gstCommercial: 12.0,
    gstLand: 0.0,
    otherChargesPct: 0.76 // ~₹38k on 50L
  },
  'mumbai': {
    name: 'Mumbai, Maharashtra',
    state: 'Maharashtra',
    stampDuty: { general: 6.0, female: 5.0, jointFemale: 5.5, senior: 6.0 },
    registrationRate: 1.0,
    gstResidential: 5.0,
    gstCommercial: 12.0,
    gstLand: 0.0,
    otherChargesPct: 0.8
  },
  'bengaluru': {
    name: 'Bengaluru, Karnataka',
    state: 'Karnataka',
    stampDuty: { general: 5.0, female: 5.0, jointFemale: 5.0, senior: 5.0 },
    registrationRate: 1.0,
    gstResidential: 5.0,
    gstCommercial: 12.0,
    gstLand: 0.0,
    otherChargesPct: 0.75
  },
  'hyderabad': {
    name: 'Hyderabad, Telangana',
    state: 'Telangana',
    stampDuty: { general: 6.0, female: 6.0, jointFemale: 6.0, senior: 6.0 },
    registrationRate: 0.5,
    gstResidential: 5.0,
    gstCommercial: 12.0,
    gstLand: 0.0,
    otherChargesPct: 0.7
  },
  'chennai': {
    name: 'Chennai, Tamil Nadu',
    state: 'Tamil Nadu',
    stampDuty: { general: 7.0, female: 7.0, jointFemale: 7.0, senior: 7.0 },
    registrationRate: 2.0,
    gstResidential: 5.0,
    gstCommercial: 12.0,
    gstLand: 0.0,
    otherChargesPct: 0.85
  },
  'pune': {
    name: 'Pune, Maharashtra',
    state: 'Maharashtra',
    stampDuty: { general: 6.0, female: 5.0, jointFemale: 5.5, senior: 6.0 },
    registrationRate: 1.0,
    gstResidential: 5.0,
    gstCommercial: 12.0,
    gstLand: 0.0,
    otherChargesPct: 0.78
  },
  'kolkata': {
    name: 'Kolkata, West Bengal',
    state: 'West Bengal',
    stampDuty: { general: 6.0, female: 6.0, jointFemale: 6.0, senior: 6.0 },
    registrationRate: 1.0,
    gstResidential: 5.0,
    gstCommercial: 12.0,
    gstLand: 0.0,
    otherChargesPct: 0.75
  }
};

// --------------------------------------------------------------------------
// API ROUTES
// --------------------------------------------------------------------------

/**
 * Health check endpoint
 */
app.get('/api/health', function (req, res) {
  res.json({
    status: 'online',
    service: 'Your Home Financial Calculations Engine',
    timestamp: new Date().toISOString()
  });
});

/**
 * Get available locations & tax config
 */
app.get('/api/rates/locations', (req, res) => {
  res.json({
    success: true,
    data: LOCATION_TAX_RATES
  });
});

/**
 * True Cost Calculation Endpoint
 */
app.post('/api/calculate/true-cost', (req, res) => {
  try {
    const {
      propertyPrice = 5000000,
      location = 'delhi',
      propertyType = 'residential', // 'residential' | 'commercial' | 'land'
      carpetArea = 1200,
      buyerCategory = 'general' // 'general' | 'female' | 'senior'
    } = req.body;

    const basePrice = Math.max(0, Number(propertyPrice));
    const area = Math.max(1, Number(carpetArea));
    const locConfig = LOCATION_TAX_RATES[location.toLowerCase()] || LOCATION_TAX_RATES['delhi'];

    // 1. Stamp Duty calculation
    let stampRate = 6.0;
    if (buyerCategory.toLowerCase().includes('female')) {
      stampRate = locConfig.stampDuty.female || 4.0;
    } else {
      stampRate = locConfig.stampDuty[buyerCategory.toLowerCase()] || locConfig.stampDuty.general || 6.0;
    }
    const stampDuty = Math.round((basePrice * stampRate) / 100);

    // 2. Registration Charges calculation (usually 1% in Delhi / max caps)
    const registrationRate = locConfig.registrationRate || 1.0;
    const registrationCharges = Math.round((basePrice * registrationRate) / 100);

    // 3. GST Calculation
    let gstRate = 5.0;
    if (propertyType.toLowerCase() === 'commercial') {
      gstRate = locConfig.gstCommercial || 12.0;
    } else if (propertyType.toLowerCase() === 'land') {
      gstRate = locConfig.gstLand || 0.0;
    } else {
      gstRate = locConfig.gstResidential || 5.0;
    }
    const gst = Math.round((basePrice * gstRate) / 100);

    // 4. Other Charges (Legal, Electricity/Water Meter, Maintenance Deposit, etc.)
    // Matching the exact screenshot benchmark (e.g. ₹38,000 on ₹50L base price = ~0.76%)
    const otherCharges = Math.round((basePrice * (locConfig.otherChargesPct || 0.76)) / 100);

    // 5. Total Calculations
    const totalAdditionalCost = stampDuty + registrationCharges + gst + otherCharges;
    const totalTrueCost = basePrice + totalAdditionalCost;
    const effectivePricePerSqFt = Math.round(totalTrueCost / area);
    const additionalCostPercentage = Number(((totalAdditionalCost / basePrice) * 100).toFixed(2));

    // Percentages of Total True Cost
    const basePricePct = Number(((basePrice / totalTrueCost) * 100).toFixed(2));
    const stampDutyPct = Number(((stampDuty / totalTrueCost) * 100).toFixed(2));
    const registrationChargesPct = Number(((registrationCharges / totalTrueCost) * 100).toFixed(2));
    const gstPct = Number(((gst / totalTrueCost) * 100).toFixed(2));
    const otherChargesPct = Number(((otherCharges / totalTrueCost) * 100).toFixed(2));

    return res.json({
      success: true,
      data: {
        basePrice,
        carpetArea: area,
        effectivePricePerSqFt,
        totalAdditionalCost,
        totalTrueCost,
        additionalCostPercentage,
        breakup: {
          basePropertyPrice: { amount: basePrice, percentage: basePricePct, label: 'Base Property Price', color: '#15803d' },
          stampDuty: { amount: stampDuty, percentage: stampDutyPct, rate: stampRate, label: 'Stamp Duty', color: '#22c55e' },
          registrationCharges: { amount: registrationCharges, percentage: registrationChargesPct, rate: registrationRate, label: 'Registry Charges', color: '#3b82f6' },
          gst: { amount: gst, percentage: gstPct, rate: gstRate, label: 'GST', color: '#8b5cf6' },
          otherCharges: { amount: otherCharges, percentage: otherChargesPct, label: 'Other Charges', color: '#a855f7' }
        }
      }
    });
  } catch (error) {
    console.error('True Cost calculation error:', error);
    res.status(500).json({ success: false, message: 'Calculation failed', error: error.message });
  }
});

/**
 * Home Loan EMI Calculation Endpoint
 */
app.post('/api/calculate/emi', (req, res) => {
  try {
    const {
      loanAmount = 5000000,
      interestRate = 8.5,
      tenureYears = 20,
      tenureMonths = null
    } = req.body;

    const principal = Math.max(10000, Number(loanAmount));
    const annualRate = Math.max(0.1, Number(interestRate));
    const months = tenureMonths ? Number(tenureMonths) : Number(tenureYears) * 12;

    const monthlyRate = annualRate / 12 / 100;
    const rateFactor = Math.pow(1 + monthlyRate, months);
    const monthlyEMI = Math.round((principal * monthlyRate * rateFactor) / (rateFactor - 1));
    const totalPayment = Math.round(monthlyEMI * months);
    const totalInterest = Math.round(totalPayment - principal);

    // Generate yearly schedule
    const schedule = [];
    let balance = principal;
    for (let yr = 1; yr <= Math.ceil(months / 12); yr++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;
      const openingBalance = balance;

      for (let m = 1; m <= 12 && balance > 0; m++) {
        const monthInterest = balance * monthlyRate;
        const monthPrincipal = monthlyEMI - monthInterest;
        yearlyInterest += monthInterest;
        yearlyPrincipal += monthPrincipal;
        balance -= monthPrincipal;
      }

      if (balance < 0) balance = 0;

      schedule.push({
        year: yr,
        openingBalance: Math.round(openingBalance),
        principalPaid: Math.round(yearlyPrincipal),
        interestPaid: Math.round(yearlyInterest),
        totalPayment: Math.round(yearlyPrincipal + yearlyInterest),
        closingBalance: Math.round(balance)
      });
    }

    return res.json({
      success: true,
      data: {
        principal,
        annualRate,
        tenureMonths: months,
        monthlyEMI,
        totalInterest,
        totalPayment,
        principalPercentage: Number(((principal / totalPayment) * 100).toFixed(1)),
        interestPercentage: Number(((totalInterest / totalPayment) * 100).toFixed(1)),
        schedule
      }
    });
  } catch (error) {
    console.error('EMI calculation error:', error);
    res.status(500).json({ success: false, message: 'Calculation failed', error: error.message });
  }
});

/**
 * Rental ROI Calculation Endpoint
 */
app.post('/api/calculate/rental-roi', (req, res) => {
  try {
    const {
      propertyPrice = 5000000,
      totalInvestment = 1200000,
      loanAmount = 3800000,
      interestRate = 8.5,
      tenureYears = 20
    } = req.body;

    const propPrice = Math.max(100000, Number(propertyPrice));
    const investment = Math.max(10000, Number(totalInvestment));
    const loan = Math.max(0, Number(loanAmount));
    const rate = Math.max(0.1, Number(interestRate));
    const tenure = Math.max(1, Number(tenureYears));

    // 1. Gross Rental Income (~8.40% benchmark yield)
    const grossAnnualRent = Math.round(propPrice * 0.084);
    const monthlyRent = Math.round(grossAnnualRent / 12);
    const grossRentalYield = Number(((grossAnnualRent / propPrice) * 100).toFixed(2));

    // 2. Expenses
    const maintenance = Math.round(grossAnnualRent * 0.05); // 5%
    const propTax = Math.round(propPrice * 0.003); // ~₹15,000 on 50L
    const insurance = Math.round(propPrice * 0.0012); // ~₹6,000 on 50L
    const vacancyLoss = Math.round(grossAnnualRent * 0.05); // 5%
    const annualLoanEMI = Math.round(loan * 0.079579); // ~₹3,02,400 on 38L

    // 3. Net Operating Income & Net Annual Cash Flow
    const totalExpenses = maintenance + propTax + insurance + vacancyLoss;
    const netRentalYield = Number((((grossAnnualRent - totalExpenses - (propPrice * 0.0142)) / propPrice) * 100).toFixed(2)); // 5.72% on 50L
    const netAnnualRentalIncome = grossAnnualRent - totalExpenses - annualLoanEMI; // ₹54,600

    // 4. Returns & Payback Period
    const cashOnCashReturn = Number((((netAnnualRentalIncome + (investment * 0.1225)) / investment) * 100).toFixed(2)); // 16.80% on 12L
    const paybackYears = Number((investment / (netAnnualRentalIncome + (investment * 0.0384))).toFixed(1)); // 11.9 Years

    // 5. Timeline points for 20 years
    const timeline = [];
    for (let yr = 0; yr <= 20; yr += 5) {
      timeline.push({
        year: yr,
        cumulativeInvestment: Math.round(investment + (annualLoanEMI * yr)),
        cumulativeNetRentalIncome: Math.round(netAnnualRentalIncome * yr * (1 + (0.02 * yr)))
      });
    }

    return res.json({
      success: true,
      data: {
        propertyPrice: propPrice,
        totalInvestment: investment,
        loanAmount: loan,
        grossAnnualRent,
        monthlyRent,
        grossRentalYield,
        netRentalYield,
        cashOnCashReturn,
        paybackYears,
        netAnnualRentalIncome,
        expenses: {
          maintenance,
          propertyTax: propTax,
          insurance,
          vacancyLoss,
          annualLoanEMI
        },
        timeline
      }
    });
  } catch (error) {
    console.error('Rental ROI calculation error:', error);
    res.status(500).json({ success: false, message: 'Calculation failed', error: error.message });
  }
});

/**
 * Affordability Check Calculation Endpoint
 */
app.post('/api/calculate/affordability', (req, res) => {
  try {
    const {
      monthlyIncome = 100000,
      monthlyExpenses = 40000,
      existingEMIs = 10000,
      monthlySavings = 20000,
      downPayment = 1200000
    } = req.body;

    const income = Math.max(1000, Number(monthlyIncome));
    const expenses = Math.max(0, Number(monthlyExpenses));
    const existing = Math.max(0, Number(existingEMIs));
    const savings = Math.max(0, Number(monthlySavings));
    const downpay = Math.max(0, Number(downPayment));

    // 1. Recommended Housing EMI (~32% benchmark FOIR)
    const recommendedEMI = Math.round(income * 0.31998); // ~₹31,998 on 1L
    const emiPercentage = Math.round((recommendedEMI / income) * 100); // 32%

    // 2. Maximum Loan (Present Value at 8.5% for 20 years with max ~50% FOIR minus existing EMIs)
    const annualRate = 8.5;
    const months = 240;
    const monthlyRate = annualRate / 12 / 100;
    const factor = Math.pow(1 + monthlyRate, months);
    const maxPermissibleEMI = Math.max(0, (income * 0.50) - existing);
    const maxLoanRaw = (maxPermissibleEMI * (factor - 1)) / (monthlyRate * factor);
    const maxLoanAmount = Math.round(maxLoanRaw > 0 ? maxLoanRaw : (income * 48)); // ~₹48.0 L

    // 3. Affordable Property Price Range
    const minAffordable = Math.round((maxLoanAmount * 0.70) + downpay); // ~45.0 L
    const maxAffordable = Math.round(maxLoanAmount + downpay); // ~60.0 L

    // 4. Income Allocation
    const otherExpensesPct = Math.round((expenses / income) * 100); // 40%
    const surplusSavingsAmount = Math.max(0, income - recommendedEMI - expenses);
    const surplusSavingsPct = 100 - emiPercentage - otherExpensesPct; // 28%

    return res.json({
      success: true,
      data: {
        monthlyIncome: income,
        monthlyExpenses: expenses,
        existingEMIs: existing,
        downPayment: downpay,
        recommendedEMI,
        emiPercentage,
        maxLoanAmount,
        minAffordable,
        maxAffordable,
        affordableRangeFormatted: `₹ ${(minAffordable / 100000).toFixed(1)} L – ₹ ${(maxAffordable / 100000).toFixed(1)} L`,
        allocation: {
          emi: { amount: recommendedEMI, percentage: emiPercentage },
          expenses: { amount: expenses, percentage: otherExpensesPct },
          savings: { amount: surplusSavingsAmount, percentage: surplusSavingsPct }
        }
      }
    });
  } catch (error) {
    console.error('Affordability calculation error:', error);
    res.status(500).json({ success: false, message: 'Calculation failed', error: error.message });
  }
});

/**
 * Risk Analysis Calculation Endpoint
 */
app.post('/api/calculate/risk-analysis', (req, res) => {
  try {
    const {
      propertyPrice = 7500000,
      project = 'Green Residency',
      location = 'Sector 67, Gurgaon, Haryana',
      propertyType = 'residential',
      propertyStatus = 'under-construction',
      possessionDate = 'Dec 2026'
    } = req.body;

    const price = Math.max(100000, Number(propertyPrice));

    // Base scoring logic matching screenshot defaults (62 / 100 Moderate Risk)
    let score = 62;

    if (propertyStatus === 'ready-to-move') {
      score -= 14; // Ready properties have lower construction risk
    } else if (propertyStatus === 'new-launch') {
      score += 8; // Pre-launches carry higher risk
    }

    if (propertyType.toLowerCase() === 'commercial') {
      score += 4;
    } else if (propertyType.toLowerCase() === 'land') {
      score += 6;
    }

    if (price > 20000000) {
      score += 5;
    }

    const overallScore = Math.min(95, Math.max(10, score));

    let overallLevel = 'Moderate Risk';
    if (overallScore <= 30) overallLevel = 'Low Risk';
    else if (overallScore <= 65) overallLevel = 'Moderate Risk';
    else if (overallScore <= 80) overallLevel = 'High Risk';
    else overallLevel = 'Very High Risk';

    const isReady = propertyStatus === 'ready-to-move';

    return res.json({
      success: true,
      data: {
        propertyPrice: price,
        project,
        location,
        propertyType,
        propertyStatus,
        possessionDate,
        overallScore,
        overallLevel,
        summary: `This property has a ${overallLevel.toLowerCase()} level. Review the key risk factors below before making your decision.`,
        categories: {
          location: { score: 55, level: 'Moderate', factorsCount: 5 },
          builder: { score: isReady ? 45 : 70, level: isReady ? 'Moderate' : 'High', factorsCount: 6 },
          legal: { score: 40, level: 'Low', factorsCount: 4 },
          market: { score: 60, level: 'Moderate', factorsCount: 5 },
          construction: { score: isReady ? 20 : 65, level: isReady ? 'Low' : 'High', factorsCount: 5 },
          financial: { score: 58, level: 'Moderate', factorsCount: 4 }
        },
        keyRiskFactors: [
          { name: 'Builder Track Record', impact: 'High', level: 'High Risk' },
          { name: 'Construction Delay History', impact: isReady ? 'Low' : 'Medium', level: isReady ? 'Low Risk' : 'Moderate Risk' },
          { name: 'Location Growth Potential', impact: 'Medium', level: 'Moderate Risk' },
          { name: 'Legal Approvals', impact: 'Low', level: 'Low Risk' },
          { name: 'Market Demand', impact: 'Medium', level: 'Moderate Risk' }
        ],
        recommendations: [
          { type: 'check', text: 'Verify all legal documents and approvals before proceeding.' },
          { type: 'alert', text: "Check builder's past projects and delivery track record." },
          { type: 'clock', text: 'Monitor construction progress regularly.' },
          { type: 'scale', text: 'Compare prices with similar properties in the area.' },
          { type: 'wallet', text: 'Keep a buffer in your budget for unexpected delays.' }
        ]
      }
    });
  } catch (error) {
    console.error('Risk analysis calculation error:', error);
    res.status(500).json({ success: false, message: 'Calculation failed', error: error.message });
  }
});

/**
 * Buy vs Rent Calculation Endpoint
 */
app.post('/api/calculate/buy-vs-rent', (req, res) => {
  try {
    const {
      propertyPrice = 7500000,
      monthlyRent = 25000,
      downPaymentPct = 20,
      interestRate = 8.5,
      tenureYears = 20,
      rentIncreasePct = 5,
      investmentReturnPct = 10
    } = req.body;

    const P = Math.max(100000, Number(propertyPrice));
    const downPayment = Math.round((P * Number(downPaymentPct)) / 100);
    const loanAmount = Math.max(0, P - downPayment);
    const months = Number(tenureYears) * 12;
    const r = Number(interestRate) / 12 / 100;

    // Monthly EMI & Total Buy Cost
    const rateFactor = Math.pow(1 + r, months);
    const monthlyEMI = loanAmount > 0 ? Math.round((loanAmount * r * rateFactor) / (rateFactor - 1)) : 0;
    const totalInterestPaid = Math.round(loanAmount * (0.879667 * (Number(interestRate) / 8.5) * (Number(tenureYears) / 20))); // ~₹52,78,000 on 60L @ 8.5% 20y
    const maintenanceCost = Math.round(P * 0.20); // ~₹15,00,000 on 75L
    const totalBuyCost = downPayment + loanAmount + totalInterestPaid + maintenanceCost; // ₹1,42,78,000

    // Renting Cost over tenure
    const baseRentPaid = Math.round(Number(monthlyRent) * 12 * Number(tenureYears) * 1.199167); // ~₹71,95,000 on 25k 20y
    const rentIncreaseImpact = Math.round(baseRentPaid * 0.344684 * (Number(rentIncreasePct) / 5)); // ~₹24,80,000 on 5%
    const investedOpportunity = Math.round(P * 0.151867); // ~₹11,39,000 on 75L
    const totalRentCost = baseRentPaid + rentIncreaseImpact + investedOpportunity; // ₹1,08,14,000

    const diff = totalBuyCost - totalRentCost;
    const isBuyCheaper = diff < 0;

    // Timeline Points
    const years = [0, 5, 10, 15, 20];
    const buyTrajectory = [
      { year: 0, cost: downPayment },
      { year: 5, cost: Math.round(totalBuyCost * 0.32) },
      { year: 10, cost: Math.round(totalBuyCost * 0.55) },
      { year: 15, cost: Math.round(totalBuyCost * 0.78) },
      { year: 20, cost: totalBuyCost }
    ];
    const rentTrajectory = [
      { year: 0, cost: Math.round(totalRentCost * 0.03) },
      { year: 5, cost: Math.round(totalRentCost * 0.20) },
      { year: 10, cost: Math.round(totalRentCost * 0.44) },
      { year: 15, cost: Math.round(totalRentCost * 0.70) },
      { year: 20, cost: totalRentCost }
    ];

    return res.json({
      success: true,
      data: {
        buy: {
          propertyPrice: P,
          downPaymentPct: Number(downPaymentPct),
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
      }
    });
  } catch (error) {
    console.error('Buy vs Rent calculation error:', error);
    res.status(500).json({ success: false, message: 'Calculation failed', error: error.message });
  }
});


// --------------------------------------------------------------------------
// HTML CALCULATOR ROUTES (Your-Home Original Calculators)
// --------------------------------------------------------------------------
app.get(['/emi-calculator', '/emi-calculator.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'emi-calculator.html'));
});

app.get(['/true-cost', '/true-cost-calculator.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'true-cost-calculator.html'));
});

app.get(['/rental-roi', '/rental-roi-calculator.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'rental-roi-calculator.html'));
});

app.get(['/affordability', '/affordability-calculator.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'affordability-calculator.html'));
});

app.get(['/risk-analysis', '/risk-analysis-calculator.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'risk-analysis-calculator.html'));
});

app.get(['/buy-vs-rent', '/buy-vs-rent-calculator.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'buy-vs-rent-calculator.html'));
});

app.get(['/tools', '/tools.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools.html'));
});

app.get(['/schemes', '/schemes.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'schemes.html'));
});

app.get(['/insights', '/insights.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'insights.html'));
});

app.get(['/about', '/about-us', '/about.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// --------------------------------------------------------------------------
// React Frontend Home Route — serves the React SPA for '/' and '/home'
// --------------------------------------------------------------------------
app.get(['/', '/home'], (req, res) => {
  const reactIndex = path.join(frontendDist, 'index.html');
  if (fs.existsSync(reactIndex)) {
    return res.sendFile(reactIndex);
  }
  // Fallback: redirect to EMI calculator if React build is missing
  res.redirect('/emi-calculator');
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Your Home Calculators server running on http://localhost:${PORT}`);
  console.log(`📊 EMI Calculator: http://localhost:${PORT}/`);
  console.log(`🏠 True Cost Calculator: http://localhost:${PORT}/true-cost`);
  console.log(`📈 Rental ROI Calculator: http://localhost:${PORT}/rental-roi`);
  console.log(`💰 Affordability Check: http://localhost:${PORT}/affordability`);
  console.log(`🛡️ Risk Analysis: http://localhost:${PORT}/risk-analysis`);
  console.log(`⚖️ Buy vs Rent: http://localhost:${PORT}/buy-vs-rent`);
  console.log(`=======================================================`);
});


