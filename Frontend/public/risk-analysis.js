/**
 * YOUR HOME - RISK ANALYSIS ENGINE (FRONTEND CONTROLLER)
 * Dynamic Risk Scoring, Gauge Meter Arc Animation, Category Risk Cards & Recommendations
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Inputs
  const projectSelect = document.getElementById('risk-project-select');
  const locationInput = document.getElementById('risk-location-input');
  const statusSelect = document.getElementById('risk-status-select');
  const priceInput = document.getElementById('risk-price-input');
  const possessionSelect = document.getElementById('risk-possession-select');
  const propTypePills = document.querySelectorAll('#prop-type-pills .type-pill-btn');

  // DOM Elements - Buttons
  const btnAnalyze = document.getElementById('btn-analyze-risk');
  const btnReset = document.getElementById('btn-reset-risk');

  // DOM Elements - Overall Score & Gauge
  const scoreValEl = document.getElementById('risk-score-val');
  const levelBadgeEl = document.getElementById('risk-level-badge');
  const gaugeFillEl = document.getElementById('gauge-meter-fill');
  const summaryTextEl = document.getElementById('risk-summary-text');

  // DOM Elements - Category Scores
  const catLocationVal = document.getElementById('cat-score-location');
  const catLocationBadge = document.getElementById('cat-level-location');
  const catLocationFactors = document.getElementById('cat-factors-location');

  const catBuilderVal = document.getElementById('cat-score-builder');
  const catBuilderBadge = document.getElementById('cat-level-builder');
  const catBuilderFactors = document.getElementById('cat-factors-builder');

  const catLegalVal = document.getElementById('cat-score-legal');
  const catLegalBadge = document.getElementById('cat-level-legal');
  const catLegalFactors = document.getElementById('cat-factors-legal');

  const catMarketVal = document.getElementById('cat-score-market');
  const catMarketBadge = document.getElementById('cat-level-market');
  const catMarketFactors = document.getElementById('cat-factors-market');

  const catConstructionVal = document.getElementById('cat-score-construction');
  const catConstructionBadge = document.getElementById('cat-level-construction');
  const catConstructionFactors = document.getElementById('cat-factors-construction');

  const catFinancialVal = document.getElementById('cat-score-financial');
  const catFinancialBadge = document.getElementById('cat-level-financial');
  const catFinancialFactors = document.getElementById('cat-factors-financial');

  // DOM Elements - Tables & Lists
  const factorsTbody = document.getElementById('risk-factors-tbody');
  const recommendationsList = document.getElementById('recommendations-list');

  // Semi-circle Arc Circumference for radius r=80: PI * 80 = 251.327
  const ARC_CIRCUMFERENCE = 251.32;

  let currentPropertyType = 'residential';

  // --------------------------------------------------------------------------
  // CURRENCY FORMATTING HELPERS
  // --------------------------------------------------------------------------
  function formatINR(val) {
    if (isNaN(val) || val === null || val === '') return '0';
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(val));
  }

  function parseINR(str) {
    if (!str) return 0;
    return parseFloat(str.toString().replace(/,/g, '').replace(/₹/g, '').trim()) || 0;
  }

  // Format currency on input
  if (priceInput) {
    priceInput.addEventListener('input', (e) => {
      const cursor = e.target.selectionStart;
      const rawVal = parseINR(e.target.value);
      if (rawVal > 0) {
        e.target.value = formatINR(rawVal);
      }
    });
  }

  // Handle Property Type Pills Selection
  propTypePills.forEach(pill => {
    pill.addEventListener('click', () => {
      propTypePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentPropertyType = pill.getAttribute('data-value') || 'residential';
      runRiskAnalysis();
    });
  });

  // --------------------------------------------------------------------------
  // GAUGE ARC ANIMATION
  // --------------------------------------------------------------------------
  function setGaugeScore(score) {
    const clampedScore = Math.min(100, Math.max(0, score));
    // 0 score = offset 251.32, 100 score = offset 0
    const offset = ARC_CIRCUMFERENCE - (ARC_CIRCUMFERENCE * (clampedScore / 100));
    
    if (gaugeFillEl) {
      gaugeFillEl.style.transition = 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      gaugeFillEl.style.strokeDashoffset = offset.toFixed(1);
    }
  }

  // Helper for badge class
  function getLevelBadgeClass(levelStr) {
    const lvl = (levelStr || '').toLowerCase();
    if (lvl.includes('low')) return 'level-low-badge';
    if (lvl.includes('very high')) return 'level-very-high-badge';
    if (lvl.includes('high')) return 'level-high-badge';
    return 'level-moderate-badge';
  }

  function getTableBadgeClass(levelStr) {
    const lvl = (levelStr || '').toLowerCase();
    if (lvl.includes('low')) return 'badge-low';
    if (lvl.includes('very high')) return 'badge-very-high';
    if (lvl.includes('high')) return 'badge-high';
    return 'badge-moderate';
  }

  function getImpactDotClass(impactStr) {
    const imp = (impactStr || '').toLowerCase();
    if (imp.includes('high')) return 'impact-high';
    if (imp.includes('low')) return 'impact-low';
    return 'impact-medium';
  }

  // --------------------------------------------------------------------------
  // RUN RISK ANALYSIS (API FETCH + LOCAL FALLBACK)
  // --------------------------------------------------------------------------
  async function runRiskAnalysis() {
    const propertyPrice = parseINR(priceInput ? priceInput.value : '7500000');
    const project = projectSelect ? projectSelect.value : 'Green Residency';
    const location = locationInput ? locationInput.value : 'Sector 67, Gurgaon, Haryana';
    const status = statusSelect ? statusSelect.value : 'under-construction';
    const possession = possessionSelect ? possessionSelect.value : 'Dec 2026';

    const payload = {
      propertyPrice,
      project,
      location,
      propertyType: currentPropertyType,
      propertyStatus: status,
      possessionDate: possession
    };

    try {
      const response = await fetch('/api/calculate/risk-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          renderRiskData(result.data);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend API request failed, using client-side risk calculation engine:', err);
    }

    // Client-side fallback calculation engine
    const fallbackData = computeClientSideRisk(payload);
    renderRiskData(fallbackData);
  }

  // --------------------------------------------------------------------------
  // CLIENT-SIDE FALLBACK CALCULATION LOGIC
  // --------------------------------------------------------------------------
  function computeClientSideRisk(p) {
    let baseScore = 62;

    // Adjust based on property status
    if (p.propertyStatus === 'ready-to-move') baseScore -= 12;
    else if (p.propertyStatus === 'new-launch') baseScore += 10;

    // Adjust based on property type
    if (p.propertyType === 'commercial') baseScore += 5;
    else if (p.propertyType === 'land') baseScore += 8;

    // Adjust based on price point
    if (p.propertyPrice > 15000000) baseScore += 4;

    const overallScore = Math.min(95, Math.max(15, baseScore));
    
    let overallLevel = 'Moderate Risk';
    if (overallScore <= 30) overallLevel = 'Low Risk';
    else if (overallScore <= 65) overallLevel = 'Moderate Risk';
    else if (overallScore <= 80) overallLevel = 'High Risk';
    else overallLevel = 'Very High Risk';

    return {
      overallScore,
      overallLevel,
      summary: `This property has a ${overallLevel.toLowerCase()} level. Review the key risk factors below before making your decision.`,
      categories: {
        location: { score: 55, level: 'Moderate', factorsCount: 5 },
        builder: { score: p.propertyStatus === 'ready-to-move' ? 45 : 70, level: p.propertyStatus === 'ready-to-move' ? 'Moderate' : 'High', factorsCount: 6 },
        legal: { score: 40, level: 'Low', factorsCount: 4 },
        market: { score: 60, level: 'Moderate', factorsCount: 5 },
        construction: { score: p.propertyStatus === 'ready-to-move' ? 20 : 65, level: p.propertyStatus === 'ready-to-move' ? 'Low' : 'High', factorsCount: 5 },
        financial: { score: 58, level: 'Moderate', factorsCount: 4 }
      },
      keyRiskFactors: [
        { name: 'Builder Track Record', impact: 'High', level: 'High Risk' },
        { name: 'Construction Delay History', impact: p.propertyStatus === 'ready-to-move' ? 'Low' : 'Medium', level: p.propertyStatus === 'ready-to-move' ? 'Low Risk' : 'Moderate Risk' },
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
    };
  }

  // --------------------------------------------------------------------------
  // RENDER DATA TO UI
  // --------------------------------------------------------------------------
  function renderRiskData(data) {
    // 1. Overall Score & Gauge
    if (scoreValEl) scoreValEl.textContent = data.overallScore;
    if (levelBadgeEl) {
      levelBadgeEl.textContent = data.overallLevel;
      levelBadgeEl.className = 'score-level-text ' + getLevelBadgeClass(data.overallLevel);
    }
    if (summaryTextEl) summaryTextEl.textContent = data.summary;
    setGaugeScore(data.overallScore);

    // 2. Category Cards
    if (data.categories) {
      const cats = data.categories;
      
      // Location
      if (cats.location) {
        if (catLocationVal) catLocationVal.textContent = cats.location.score;
        if (catLocationBadge) {
          catLocationBadge.textContent = cats.location.level;
          catLocationBadge.className = 'cat-level-badge ' + getLevelBadgeClass(cats.location.level);
        }
        if (catLocationFactors) catLocationFactors.textContent = `Factors: ${cats.location.factorsCount}`;
      }

      // Builder
      if (cats.builder) {
        if (catBuilderVal) catBuilderVal.textContent = cats.builder.score;
        if (catBuilderBadge) {
          catBuilderBadge.textContent = cats.builder.level;
          catBuilderBadge.className = 'cat-level-badge ' + getLevelBadgeClass(cats.builder.level);
        }
        if (catBuilderFactors) catBuilderFactors.textContent = `Factors: ${cats.builder.factorsCount}`;
      }

      // Legal
      if (cats.legal) {
        if (catLegalVal) catLegalVal.textContent = cats.legal.score;
        if (catLegalBadge) {
          catLegalBadge.textContent = cats.legal.level;
          catLegalBadge.className = 'cat-level-badge ' + getLevelBadgeClass(cats.legal.level);
        }
        if (catLegalFactors) catLegalFactors.textContent = `Factors: ${cats.legal.factorsCount}`;
      }

      // Market
      if (cats.market) {
        if (catMarketVal) catMarketVal.textContent = cats.market.score;
        if (catMarketBadge) {
          catMarketBadge.textContent = cats.market.level;
          catMarketBadge.className = 'cat-level-badge ' + getLevelBadgeClass(cats.market.level);
        }
        if (catMarketFactors) catMarketFactors.textContent = `Factors: ${cats.market.factorsCount}`;
      }

      // Construction
      if (cats.construction) {
        if (catConstructionVal) catConstructionVal.textContent = cats.construction.score;
        if (catConstructionBadge) {
          catConstructionBadge.textContent = cats.construction.level;
          catConstructionBadge.className = 'cat-level-badge ' + getLevelBadgeClass(cats.construction.level);
        }
        if (catConstructionFactors) catConstructionFactors.textContent = `Factors: ${cats.construction.factorsCount}`;
      }

      // Financial
      if (cats.financial) {
        if (catFinancialVal) catFinancialVal.textContent = cats.financial.score;
        if (catFinancialBadge) {
          catFinancialBadge.textContent = cats.financial.level;
          catFinancialBadge.className = 'cat-level-badge ' + getLevelBadgeClass(cats.financial.level);
        }
        if (catFinancialFactors) catFinancialFactors.textContent = `Factors: ${cats.financial.factorsCount}`;
      }
    }

    // 3. Key Risk Factors Table
    if (factorsTbody && Array.isArray(data.keyRiskFactors)) {
      factorsTbody.innerHTML = data.keyRiskFactors.map(f => `
        <tr>
          <td class="factor-name">${f.name}</td>
          <td class="factor-impact"><span class="impact-dot ${getImpactDotClass(f.impact)}"></span> ${f.impact}</td>
          <td class="factor-level"><span class="table-badge ${getTableBadgeClass(f.level)}">${f.level}</span></td>
        </tr>
      `).join('');
    }

    // 4. Recommendations List
    if (recommendationsList && Array.isArray(data.recommendations)) {
      const getIconSvg = (type) => {
        switch (type) {
          case 'check':
            return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
          case 'alert':
            return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
          case 'clock':
            return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
          case 'scale':
            return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"></path><path d="M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4"></path></svg>`;
          default:
            return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4z"></path></svg>`;
        }
      };

      recommendationsList.innerHTML = data.recommendations.map(r => `
        <li class="rec-item">
          <span class="rec-icon rec-icon-${r.type}">${getIconSvg(r.type)}</span>
          <span class="rec-text">${r.text}</span>
        </li>
      `).join('');
    }
  }

  // --------------------------------------------------------------------------
  // EVENT LISTENERS
  // --------------------------------------------------------------------------
  if (btnAnalyze) {
    btnAnalyze.addEventListener('click', runRiskAnalysis);
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (projectSelect) projectSelect.value = 'Green Residency';
      if (locationInput) locationInput.value = 'Sector 67, Gurgaon, Haryana';
      if (statusSelect) statusSelect.value = 'under-construction';
      if (priceInput) priceInput.value = '75,00,000';
      if (possessionSelect) possessionSelect.value = 'Dec 2026';

      propTypePills.forEach(p => p.classList.remove('active'));
      if (propTypePills[0]) propTypePills[0].classList.add('active');
      currentPropertyType = 'residential';

      runRiskAnalysis();
    });
  }

  // Trigger initial calculation on page load
  runRiskAnalysis();
});
