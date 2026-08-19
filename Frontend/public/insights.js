/**
 * Your Home - Market Insights Interactive Dashboard Engine
 * Version: 2.5 (Dynamic 3D Card Tilt, Staggered Counter Physics & Smooth SVG Wave Animations)
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. DATASETS FOR DATE PERIODS & METRICS
  // --------------------------------------------------------------------------
  const INSIGHTS_DATA = {
    '1y': {
      label: 'Apr 2024 - Apr 2025',
      kpis: {
        avgPrice: { val: 6842, prefix: '₹', suffix: ' / sq.ft.', growth: '↑ 6.4% vs last year', isUp: true },
        rentalYield: { val: 4.2, prefix: '', suffix: '%', growth: '↑ 0.5% vs last year', isUp: true },
        salesGrowth: { val: 12.8, prefix: '', suffix: '%', growth: '↑ 2.1% vs last year', isUp: true },
        topCity: { val: 'Bengaluru', prefix: '', suffix: '', growth: '↑ 7.9% price growth', isUp: true }
      },
      trend: {
        points: [
          { month: 'May \'24', val: 5600, label: '₹5,600' },
          { month: 'Jul \'24', val: 5850, label: '₹5,850' },
          { month: 'Sep \'24', val: 6100, label: '₹6,100' },
          { month: 'Nov \'24', val: 6320, label: '₹6,320' },
          { month: 'Jan \'25', val: 6540, label: '₹6,540' },
          { month: 'Mar \'25', val: 6720, label: '₹6,720' },
          { month: 'Apr \'25', val: 6842, label: '₹6,842' }
        ],
        minVal: 4000,
        maxVal: 8000,
        yLabels: ['₹8k', '₹6k', '₹4k', '₹2k']
      },
      cities: [
        { name: 'Bengaluru', pct: 7.9, barWidth: 85 },
        { name: 'Hyderabad', pct: 6.7, barWidth: 72 },
        { name: 'Pune', pct: 6.1, barWidth: 65 },
        { name: 'Noida', pct: 5.4, barWidth: 58 },
        { name: 'Mumbai', pct: 4.8, barWidth: 50 }
      ],
      demandSupply: { demand: 68, supply: 32 },
      priceDistribution: [
        { label: '< ₹40 L', pct: 18, color: '#10b981' },
        { label: '₹40 L - ₹80 L', pct: 32, color: '#3b82f6' },
        { label: '₹80 L - ₹1.5 Cr', pct: 27, color: '#8b5cf6' },
        { label: '₹1.5 Cr - ₹3 Cr', pct: 15, color: '#f59e0b' },
        { label: '> ₹3 Cr', pct: 8, color: '#f97316' }
      ]
    },
    'prev_1y': {
      label: 'Apr 2023 - Mar 2024',
      kpis: {
        avgPrice: { val: 6430, prefix: '₹', suffix: ' / sq.ft.', growth: '↑ 5.2% vs prev year', isUp: true },
        rentalYield: { val: 3.9, prefix: '', suffix: '%', growth: '↑ 0.3% vs prev year', isUp: true },
        salesGrowth: { val: 10.7, prefix: '', suffix: '%', growth: '↑ 1.8% vs prev year', isUp: true },
        topCity: { val: 'Hyderabad', prefix: '', suffix: '', growth: '↑ 8.4% price growth', isUp: true }
      },
      trend: {
        points: [
          { month: 'May \'23', val: 5100, label: '₹5,100' },
          { month: 'Jul \'23', val: 5320, label: '₹5,320' },
          { month: 'Sep \'23', val: 5600, label: '₹5,600' },
          { month: 'Nov \'23', val: 5850, label: '₹5,850' },
          { month: 'Jan \'24', val: 6100, label: '₹6,100' },
          { month: 'Feb \'24', val: 6280, label: '₹6,280' },
          { month: 'Mar \'24', val: 6430, label: '₹6,430' }
        ],
        minVal: 4000,
        maxVal: 8000,
        yLabels: ['₹8k', '₹6k', '₹4k', '₹2k']
      },
      cities: [
        { name: 'Hyderabad', pct: 8.4, barWidth: 90 },
        { name: 'Bengaluru', pct: 7.2, barWidth: 78 },
        { name: 'Pune', pct: 5.8, barWidth: 62 },
        { name: 'Gurugram', pct: 5.1, barWidth: 54 },
        { name: 'Mumbai', pct: 4.2, barWidth: 46 }
      ],
      demandSupply: { demand: 64, supply: 36 },
      priceDistribution: [
        { label: '< ₹40 L', pct: 22, color: '#10b981' },
        { label: '₹40 L - ₹80 L', pct: 35, color: '#3b82f6' },
        { label: '₹80 L - ₹1.5 Cr', pct: 24, color: '#8b5cf6' },
        { label: '₹1.5 Cr - ₹3 Cr', pct: 13, color: '#f59e0b' },
        { label: '> ₹3 Cr', pct: 6, color: '#f97316' }
      ]
    },
    '3y': {
      label: '3-Year Trend (2022 - 2025)',
      kpis: {
        avgPrice: { val: 6842, prefix: '₹', suffix: ' / sq.ft.', growth: '↑ 24.8% 3-Yr CAGR', isUp: true },
        rentalYield: { val: 4.2, prefix: '', suffix: '%', growth: '↑ 0.9% 3-Yr Gain', isUp: true },
        salesGrowth: { val: 34.2, prefix: '', suffix: '%', growth: '↑ Multi-Year Peak', isUp: true },
        topCity: { val: 'Bengaluru', prefix: '', suffix: '', growth: '↑ 28.4% 3-Yr Boom', isUp: true }
      },
      trend: {
        points: [
          { month: '2022', val: 4800, label: '₹4,800' },
          { month: 'Mid \'22', val: 5150, label: '₹5,150' },
          { month: '2023', val: 5600, label: '₹5,600' },
          { month: 'Mid \'23', val: 5950, label: '₹5,950' },
          { month: '2024', val: 6430, label: '₹6,430' },
          { month: 'Mid \'24', val: 6620, label: '₹6,620' },
          { month: '2025', val: 6842, label: '₹6,842' }
        ],
        minVal: 4000,
        maxVal: 8000,
        yLabels: ['₹8k', '₹6k', '₹4k', '₹2k']
      },
      cities: [
        { name: 'Bengaluru', pct: 28.4, barWidth: 95 },
        { name: 'Hyderabad', pct: 26.1, barWidth: 88 },
        { name: 'Pune', pct: 21.5, barWidth: 72 },
        { name: 'Noida / NCR', pct: 19.8, barWidth: 66 },
        { name: 'Mumbai', pct: 16.4, barWidth: 55 }
      ],
      demandSupply: { demand: 71, supply: 29 },
      priceDistribution: [
        { label: '< ₹40 L', pct: 15, color: '#10b981' },
        { label: '₹40 L - ₹80 L', pct: 30, color: '#3b82f6' },
        { label: '₹80 L - ₹1.5 Cr', pct: 29, color: '#8b5cf6' },
        { label: '₹1.5 Cr - ₹3 Cr', pct: 17, color: '#f59e0b' },
        { label: '> ₹3 Cr', pct: 9, color: '#f97316' }
      ]
    }
  };

  // Market Insight Deep Dive Content Modal Data
  const MODAL_INSIGHTS = {
    'residential-demand': {
      title: 'Residential Demand Surging in 2025',
      badge: 'Demand Trend',
      badgeColor: '#15803d',
      summary: '3 BHK and spacious 2.5 BHK units have witnessed a massive 38% increase in buyer inquiries across Delhi NCR, Bengaluru, Mumbai, and Hyderabad. High-income professionals are prioritizing dedicated work-from-home space, gated community lifestyle, and proximity to major metro lines.',
      keyStats: [
        { label: 'Most In-Demand Unit', val: '3 BHK (1,400 - 1,800 sq.ft.)' },
        { label: 'Buyer Inquiry Surge', val: '+38% YoY' },
        { label: 'Top Metro Hubs', val: 'Whitefield, Gachibowli, Noida Sec 150' },
        { label: 'Average Days on Market', val: '42 Days (Fastest in 5 yrs)' }
      ],
      takeaway: 'Buyers should lock in pre-launch or under-construction builder inventory early to avoid sharp price appreciations upon occupancy certificate (OC) issuance.'
    },
    'prices-moving-up': {
      title: 'Property Capital Appreciation Trends',
      badge: 'Price Dynamics',
      badgeColor: '#2563eb',
      summary: 'National average residential property rates have increased by 6.4% year-on-year. Infrastructure growth, including expansion of Regional Rapid Transit Systems (RRTS), new expressways, and upcoming international airports, is driving steep appreciation in suburban corridors.',
      keyStats: [
        { label: 'All India Price Index', val: '₹6,842 / sq.ft. (+6.4%)' },
        { label: 'Suburban Growth Corridors', val: '+11.2% YoY' },
        { label: 'Raw Material Inflation Impact', val: '+3.5% on baseline cost' },
        { label: 'Forecast Next 12 Months', val: '5.8% - 7.2% sustained growth' }
      ],
      takeaway: 'Investing along newly announced arterial transit corridors delivers maximum 3-5 year capital multiplier benefits.'
    },
    'rental-returns': {
      title: 'Rental Yields Reaching Multi-Year Highs',
      badge: 'Investor Returns',
      badgeColor: '#ea580c',
      summary: 'With hybrid working models settling into permanent routines, corporate office occupancy has crossed 85%. Rental yields in IT corridor clusters (Bengaluru, Hyderabad, Pune, Gurugram) have climbed from 3.6% to 4.2% - 4.8%, creating strong passive cash flow for property investors.',
      keyStats: [
        { label: 'National Average Yield', val: '4.2% Gross Annual Return' },
        { label: 'Tech Corridor Peak Yield', val: 'Up to 5.1% (Koramangala, Hitec City)' },
        { label: 'Rental Escalation Rate', val: '7% - 10% annual increase' },
        { label: 'Average Tenant Vacancy', val: '< 15 days in tier-1 areas' }
      ],
      takeaway: 'Properties within a 15-minute commute to major IT tech hubs offer the lowest vacancy risk and immediate tenant onboarding.'
    },
    'loan-interest-stable': {
      title: 'RBI Monetary Policy & Home Loan Rates',
      badge: 'Finance & Lending',
      badgeColor: '#7c3aed',
      summary: 'The Reserve Bank of India (RBI) repo rate stability has maintained home loan interest rates around 8.50% - 8.75% across leading public and private sector banks. Favorable bank spreads and subsidized PMAY CLSS incentives continue to support borrowing power.',
      keyStats: [
        { label: 'Benchmark Repo Rate', val: '6.50% (Repo Linked Lending Rate)' },
        { label: 'Top Bank Interest Range', val: '8.40% - 8.75% p.a.' },
        { label: 'Avg. Loan Processing Fee', val: '0.25% - 0.50% or waived' },
        { label: 'Best Loan-to-Value (LTV)', val: 'Up to 80% of property cost' }
      ],
      takeaway: 'Borrowers can explore balance transfer options or step-up EMI structures to optimize interest amortization during the initial 5-year loan window.'
    }
  };

  let currentPeriod = '1y';

  // --------------------------------------------------------------------------
  // 2. DOM ELEMENTS
  // --------------------------------------------------------------------------
  const dateSelectorBtn = document.getElementById('dateSelectorBtn');
  const dateDropdownMenu = document.getElementById('dateDropdownMenu');
  const dateSelectorLabel = document.getElementById('dateSelectorLabel');
  const dateItems = document.querySelectorAll('.date-dropdown-item');

  // KPI elements
  const kpiPriceVal = document.getElementById('kpiPriceVal');
  const kpiPriceGrowth = document.getElementById('kpiPriceGrowth');
  const kpiYieldVal = document.getElementById('kpiYieldVal');
  const kpiYieldGrowth = document.getElementById('kpiYieldGrowth');
  const kpiSalesVal = document.getElementById('kpiSalesVal');
  const kpiSalesGrowth = document.getElementById('kpiSalesGrowth');
  const kpiCityVal = document.getElementById('kpiCityVal');
  const kpiCityGrowth = document.getElementById('kpiCityGrowth');

  // SVG Chart elements
  const svgChart = document.getElementById('trendSvgChart');
  const chartCurvePath = document.getElementById('chartCurvePath');
  const chartAreaFill = document.getElementById('chartAreaFill');
  const chartPointsGroup = document.getElementById('chartPointsGroup');
  const chartHoverPill = document.getElementById('chartHoverPill');
  const chartHoverDate = document.getElementById('chartHoverDate');
  const chartHoverVal = document.getElementById('chartHoverVal');
  const chartXAxisGroup = document.getElementById('chartXAxisGroup');
  const metricSelect = document.getElementById('trendMetricSelect');

  // City Growth elements
  const cityGrowthContainer = document.getElementById('cityGrowthContainer');

  // Donut chart elements
  const donutDemandSlice = document.getElementById('donutDemandSlice');
  const donutSupplySlice = document.getElementById('donutSupplySlice');
  const demandPctVal = document.getElementById('demandPctVal');
  const supplyPctVal = document.getElementById('supplyPctVal');

  // Distribution chart
  const priceDistSvg = document.getElementById('priceDistSvg');
  const priceDistLegend = document.getElementById('priceDistLegend');

  // Modal elements
  const insightsModal = document.getElementById('insightsModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalSummary = document.getElementById('modalSummary');
  const modalStatsGrid = document.getElementById('modalStatsGrid');
  const modalTakeaway = document.getElementById('modalTakeaway');

  // --------------------------------------------------------------------------
  // 3. DATE SELECTOR DROPDOWN INTERACTION
  // --------------------------------------------------------------------------
  if (dateSelectorBtn && dateDropdownMenu) {
    dateSelectorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dateDropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      dateDropdownMenu.classList.remove('show');
    });

    dateItems.forEach(item => {
      item.addEventListener('click', () => {
        const period = item.getAttribute('data-period');
        if (period && INSIGHTS_DATA[period]) {
          dateItems.forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          currentPeriod = period;
          dateSelectorLabel.textContent = INSIGHTS_DATA[period].label;
          dateDropdownMenu.classList.remove('show');
          renderDashboard(period, true);
        }
      });
    });
  }

  // Metric Select Listener
  if (metricSelect) {
    metricSelect.addEventListener('change', () => {
      renderLineChart(currentPeriod);
    });
  }

  // --------------------------------------------------------------------------
  // 4. ANIMATED NUMBER COUNTERS (Starting from 0 with Smooth Cubic Easing)
  // --------------------------------------------------------------------------
  function animateValue(elem, start, end, duration, prefix = '', suffix = '', decimals = 0) {
    if (!elem) return;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      const current = start + (end - start) * easeProgress;
      
      let formatted = decimals > 0 
        ? current.toFixed(decimals) 
        : Math.round(current).toLocaleString('en-IN');
      
      elem.textContent = `${prefix}${formatted}${suffix}`;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // --------------------------------------------------------------------------
  // 5. SVG LINE CHART GENERATION WITH SMOOTH SPLINE & INTERACTIVE POINTS
  // --------------------------------------------------------------------------
  function renderLineChart(periodKey) {
    const data = INSIGHTS_DATA[periodKey];
    if (!data || !svgChart) return;

    const points = data.trend.points;
    const width = 460;
    const height = 180;
    const padX = 35;
    const padY = 25;
    const chartW = width - padX * 2;
    const chartH = height - padY * 2;

    const minVal = 4500;
    const maxVal = 7500;

    // Compute coordinate points
    const coords = points.map((p, idx) => {
      const x = padX + (idx / (points.length - 1)) * chartW;
      const normalizedY = (p.val - minVal) / (maxVal - minVal);
      const y = (height - padY) - (normalizedY * chartH);
      return { x, y, data: p };
    });

    // Build smooth cubic bezier curve SVG path
    let pathD = `M ${coords[0].x},${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2 < coords.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      pathD += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }

    // Area fill under curve
    const areaD = `${pathD} L ${coords[coords.length - 1].x},${height - padY + 10} L ${coords[0].x},${height - padY + 10} Z`;

    if (chartCurvePath) {
      chartCurvePath.setAttribute('d', pathD);
      chartCurvePath.style.strokeDasharray = '1000';
      chartCurvePath.style.strokeDashoffset = '1000';
      chartCurvePath.getBoundingClientRect(); // reflow
      chartCurvePath.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)';
      chartCurvePath.style.strokeDashoffset = '0';
    }

    if (chartAreaFill) {
      chartAreaFill.setAttribute('d', areaD);
      chartAreaFill.style.opacity = '0';
      chartAreaFill.getBoundingClientRect();
      chartAreaFill.style.transition = 'opacity 0.8s ease 0.4s';
      chartAreaFill.style.opacity = '1';
    }

    // Render interactive data circles and X-axis labels
    if (chartPointsGroup) {
      chartPointsGroup.innerHTML = '';
      coords.forEach((coord, idx) => {
        const isLatest = idx === coords.length - 1;
        
        // Add animated pulse beacon to latest point
        if (isLatest) {
          const pulseCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          pulseCircle.setAttribute('cx', coord.x);
          pulseCircle.setAttribute('cy', coord.y);
          pulseCircle.setAttribute('r', '8');
          pulseCircle.setAttribute('class', 'chart-beacon-ping');
          chartPointsGroup.appendChild(pulseCircle);
        }

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', coord.x);
        circle.setAttribute('cy', coord.y);
        circle.setAttribute('class', `chart-data-point ${isLatest ? 'active' : ''}`);
        
        // Hover interaction
        circle.addEventListener('mouseenter', () => {
          document.querySelectorAll('.chart-data-point').forEach(c => c.classList.remove('active'));
          circle.classList.add('active');
          showChartTooltip(coord);
        });

        chartPointsGroup.appendChild(circle);
      });
    }

    // Render X Axis month labels
    if (chartXAxisGroup) {
      chartXAxisGroup.innerHTML = '';
      coords.forEach((coord) => {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', coord.x);
        text.setAttribute('y', height + 8);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('class', 'chart-axis-text');
        text.textContent = coord.data.month;
        chartXAxisGroup.appendChild(text);
      });
    }

    // Show initial tooltip on the latest data point (rightmost)
    if (coords.length > 0) {
      showChartTooltip(coords[coords.length - 1]);
    }
  }

  function showChartTooltip(coord) {
    if (!chartHoverPill || !svgChart) return;
    const parentRect = svgChart.parentElement.getBoundingClientRect();
    
    // Position percentage relative to parent
    const leftPx = (coord.x / 460) * parentRect.width;
    const topPx = (coord.y / 180) * parentRect.height;

    chartHoverPill.style.left = `${leftPx}px`;
    chartHoverPill.style.top = `${topPx - 10}px`;
    if (chartHoverDate) chartHoverDate.textContent = coord.data.month;
    if (chartHoverVal) chartHoverVal.textContent = `${coord.data.label} / sq.ft.`;
    chartHoverPill.style.opacity = '1';
  }

  // --------------------------------------------------------------------------
  // 6. TOP CITIES BY PRICE GROWTH PROGRESS BARS
  // --------------------------------------------------------------------------
  function renderCityGrowth(periodKey) {
    const data = INSIGHTS_DATA[periodKey];
    if (!data || !cityGrowthContainer) return;

    cityGrowthContainer.innerHTML = '';
    data.cities.forEach(city => {
      const row = document.createElement('div');
      row.className = 'growth-city-row';
      row.innerHTML = `
        <span class="growth-city-name">${city.name}</span>
        <div class="growth-bar-track">
          <div class="growth-bar-fill" style="width: 0%;" data-width="${city.barWidth}%"></div>
        </div>
        <span class="growth-city-val">${city.pct}%</span>
      `;
      cityGrowthContainer.appendChild(row);
    });

    // Trigger smooth fill expansion with staggered delay
    setTimeout(() => {
      const fills = cityGrowthContainer.querySelectorAll('.growth-bar-fill');
      fills.forEach((fill, i) => {
        setTimeout(() => {
          fill.style.width = fill.getAttribute('data-width');
        }, i * 90);
      });
    }, 60);
  }

  // --------------------------------------------------------------------------
  // 7. DEMAND VS SUPPLY DONUT CHART (Sweep-in Animation)
  // --------------------------------------------------------------------------
  function renderDemandSupply(periodKey) {
    const data = INSIGHTS_DATA[periodKey];
    if (!data) return;

    const { demand, supply } = data.demandSupply;
    const radius = 42;
    const circumference = 2 * Math.PI * radius; // ~263.89

    animateValue(demandPctVal, 0, demand, 900, '', '%');
    animateValue(supplyPctVal, 0, supply, 900, '', '%');

    const demandStroke = (demand / 100) * circumference;
    const supplyStroke = (supply / 100) * circumference;

    if (donutDemandSlice) {
      donutDemandSlice.style.transition = 'none';
      donutDemandSlice.style.strokeDasharray = `0 ${circumference}`;
      donutDemandSlice.style.strokeDashoffset = '0';
      setTimeout(() => {
        donutDemandSlice.style.transition = 'stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        donutDemandSlice.style.strokeDasharray = `${demandStroke} ${circumference}`;
      }, 50);
    }

    if (donutSupplySlice) {
      donutSupplySlice.style.transition = 'none';
      donutSupplySlice.style.strokeDasharray = `0 ${circumference}`;
      donutSupplySlice.style.strokeDashoffset = `-${demandStroke}`;
      setTimeout(() => {
        donutSupplySlice.style.transition = 'stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        donutSupplySlice.style.strokeDasharray = `${supplyStroke} ${circumference}`;
      }, 50);
    }
  }

  // --------------------------------------------------------------------------
  // 8. PRICE RANGE DISTRIBUTION DONUT CHART & LEGEND
  // --------------------------------------------------------------------------
  function renderPriceDistribution(periodKey) {
    const data = INSIGHTS_DATA[periodKey];
    if (!data) return;

    const distList = data.priceDistribution;
    const radius = 42;
    const circumference = 2 * Math.PI * radius; // ~263.89

    if (priceDistSvg) {
      priceDistSvg.innerHTML = `
        <circle cx="60" cy="60" r="${radius}" stroke="#f1f5f9" stroke-width="22" fill="none" />
      `;

      let accumulatedOffset = 0;
      distList.forEach(item => {
        const strokeLen = (item.pct / 100) * circumference;
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '60');
        circle.setAttribute('cy', '60');
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', item.color);
        circle.setAttribute('stroke-width', '22');
        circle.setAttribute('class', 'donut-segment');
        circle.style.strokeDasharray = `0 ${circumference}`;
        circle.style.strokeDashoffset = `-${accumulatedOffset}`;
        priceDistSvg.appendChild(circle);

        setTimeout(() => {
          circle.style.transition = 'stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
          circle.style.strokeDasharray = `${strokeLen} ${circumference}`;
        }, 60);

        accumulatedOffset += strokeLen;
      });
    }

    if (priceDistLegend) {
      priceDistLegend.innerHTML = '';
      distList.forEach(item => {
        const row = document.createElement('div');
        row.className = 'dist-legend-item';
        row.innerHTML = `
          <div class="dist-legend-left">
            <span class="legend-color-dot" style="background-color: ${item.color};"></span>
            <span>${item.label}</span>
          </div>
          <span class="dist-legend-pct">${item.pct}%</span>
        `;
        priceDistLegend.appendChild(row);
      });
    }
  }

  // --------------------------------------------------------------------------
  // 9. 3D CARD TILT & SPECULAR SHEEN ANIMATION
  // --------------------------------------------------------------------------
  function init3DTilt() {
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        
        const shine = card.querySelector('.card-shine-layer');
        if (shine) {
          shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(22, 163, 74, 0.15), transparent 70%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        const shine = card.querySelector('.card-shine-layer');
        if (shine) {
          shine.style.background = 'transparent';
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. FULL DASHBOARD RENDER ORCHESTRATOR
  // --------------------------------------------------------------------------
  function renderDashboard(periodKey, isFilterSwitch = false) {
    const data = INSIGHTS_DATA[periodKey];
    if (!data) return;

    const startPrice = isFilterSwitch ? 5000 : 0;
    const startYield = isFilterSwitch ? 2.0 : 0;
    const startSales = isFilterSwitch ? 5.0 : 0;

    // 1. Update KPI Card numbers with animated easing
    animateValue(kpiPriceVal, startPrice, data.kpis.avgPrice.val, 1100, '₹', '');
    if (kpiPriceGrowth) kpiPriceGrowth.textContent = data.kpis.avgPrice.growth;

    animateValue(kpiYieldVal, startYield, data.kpis.rentalYield.val, 1100, '', '%', 1);
    if (kpiYieldGrowth) kpiYieldGrowth.textContent = data.kpis.rentalYield.growth;

    animateValue(kpiSalesVal, startSales, data.kpis.salesGrowth.val, 1100, '', '%', 1);
    if (kpiSalesGrowth) kpiSalesGrowth.textContent = data.kpis.salesGrowth.growth;

    if (kpiCityVal) kpiCityVal.textContent = data.kpis.topCity.val;
    if (kpiCityGrowth) kpiCityGrowth.textContent = data.kpis.topCity.growth;

    // 2. Render Line Chart with draw animation
    renderLineChart(periodKey);

    // 3. Render Top Cities with smooth progress fill
    renderCityGrowth(periodKey);

    // 4. Render Demand vs Supply with sweep-in animation
    renderDemandSupply(periodKey);

    // 5. Render Price Distribution
    renderPriceDistribution(periodKey);
  }

  // --------------------------------------------------------------------------
  // 11. MARKET INSIGHTS MODAL POPUP
  // --------------------------------------------------------------------------
  window.openInsightModal = function(insightId) {
    const item = MODAL_INSIGHTS[insightId];
    if (!item || !insightsModal) return;

    if (modalBadge) {
      modalBadge.textContent = item.badge;
      modalBadge.style.backgroundColor = `${item.badgeColor}15`;
      modalBadge.style.color = item.badgeColor;
    }
    if (modalTitle) modalTitle.textContent = item.title;
    if (modalSummary) modalSummary.textContent = item.summary;

    if (modalStatsGrid) {
      modalStatsGrid.innerHTML = '';
      item.keyStats.forEach(stat => {
        const div = document.createElement('div');
        div.style.background = '#f8fafc';
        div.style.padding = '12px 14px';
        div.style.borderRadius = '10px';
        div.style.border = '1px solid #e2e8f0';
        div.innerHTML = `
          <div style="font-size: 11px; color: #64748b; font-weight: 500; margin-bottom: 4px;">${stat.label}</div>
          <strong style="font-size: 14px; color: #0f172a; font-family: var(--font-display, sans-serif);">${stat.val}</strong>
        `;
        modalStatsGrid.appendChild(div);
      });
    }

    if (modalTakeaway) modalTakeaway.textContent = item.takeaway;

    insightsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeInsightModal = function() {
    if (!insightsModal) return;
    insightsModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeInsightModal);
  }

  if (insightsModal) {
    insightsModal.addEventListener('click', (e) => {
      if (e.target === insightsModal) closeInsightModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && insightsModal && insightsModal.classList.contains('active')) {
      closeInsightModal();
    }
  });

  // --------------------------------------------------------------------------
  // 12. INITIALIZE DASHBOARD & 3D TILT
  // --------------------------------------------------------------------------
  renderDashboard(currentPeriod, false);
  init3DTilt();
});
