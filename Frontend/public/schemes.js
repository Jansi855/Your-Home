/**
 * YOUR HOME - GOVERNMENT SCHEMES ENGINE & INTERACTIVITY
 * Category filtering, live search, interactive details modal, and eligibility checker wizard.
 */

// --------------------------------------------------------------------------
// SCHEMES MASTER DATA
// --------------------------------------------------------------------------
const SCHEMES_DATABASE = {
  'pmay-urban': {
    id: 'pmay-urban',
    title: 'PMAY (Urban)',
    fullName: 'Pradhan Mantri Awas Yojana (Urban) 2.0',
    ministry: 'Ministry of Housing and Urban Affairs (MoHUA)',
    badge: 'Affordable Housing',
    theme: 'theme-green',
    accentColor: '#15803d',
    categories: ['first-time', 'affordable', 'loan-finance'],
    summary: 'Central government scheme providing upfront interest subsidy on home loans for eligible urban families.',
    metrics: [
      { label: 'Interest Subsidy', value: 'Up to 6.5%', sub: 'on Home Loan' },
      { label: 'Benefit Upto', value: '₹2.67 Lakh', sub: 'Direct Credit' },
      { label: 'Max Loan Tenure', value: '20 Years', sub: 'Subsidized Duration' },
      { label: 'Carpet Area Cap', value: '30 to 200 sq.m', sub: 'Based on Income Slab' }
    ],
    eligibility: {
      target: 'Families with annual income up to ₹18 LPA with no pucca house anywhere in India.',
      slabs: [
        { group: 'EWS (Economically Weaker)', income: 'Up to ₹3.0 Lakh/yr', subsidy: '6.50%', maxSubsidy: '₹2.67 Lakh' },
        { group: 'LIG (Low Income Group)', income: '₹3.0L to ₹6.0 Lakh/yr', subsidy: '6.50%', maxSubsidy: '₹2.67 Lakh' },
        { group: 'MIG-I (Middle Income Group I)', income: '₹6.0L to ₹12.0 Lakh/yr', subsidy: '4.00%', maxSubsidy: '₹2.35 Lakh' },
        { group: 'MIG-II (Middle Income Group II)', income: '₹12.0L to ₹18.0 Lakh/yr', subsidy: '3.00%', maxSubsidy: '₹2.30 Lakh' }
      ]
    },
    documents: [
      'Aadhaar Card of all family members',
      'PAN Card & Income Certificate / ITR (Last 2 Years)',
      'Bank Account Statement (6 months)',
      'Property Allotment Letter / Agreement to Sale',
      'Affidavit confirming no existing pucca house ownership'
    ],
    applicationSteps: [
      'Apply directly through your lending bank/NBFC when applying for a home loan.',
      'Bank submits your CLSS subsidy claim to Central Nodal Agencies (HUDCO / NHB / SBI).',
      'Upon verification, the subsidy amount is credited upfront directly into your loan account, reducing your principal balance and monthly EMI!'
    ]
  },

  'tax-benefits': {
    id: 'tax-benefits',
    title: 'Home Loan Tax Benefits',
    fullName: 'Income Tax Act Deductions (Sec 80C & Sec 24b)',
    ministry: 'Ministry of Finance, Government of India',
    badge: 'Tax Benefits',
    theme: 'theme-blue',
    accentColor: '#2563eb',
    categories: ['tax-benefits', 'first-time'],
    summary: 'Tax deductions on home loan repayment allowed under the Indian Income Tax Act for individual taxpayers.',
    metrics: [
      { label: 'Principal Deduction', value: '₹1.50 Lakh', sub: 'Under Section 80C' },
      { label: 'Interest Deduction', value: '₹2.00 Lakh', sub: 'Under Section 24(b)' },
      { label: 'Joint Ownership Tax Benefit', value: 'Up to ₹7.00 Lakh', sub: '₹3.5L per co-borrower' },
      { label: 'Annual Tax Savings', value: 'Up to ₹1,09,200', sub: 'in 30% Tax Bracket' }
    ],
    eligibility: {
      target: 'Any individual salaried or self-employed home loan borrower purchasing/constructing a residential home.',
      slabs: [
        { group: 'Section 80C (Principal)', income: 'All Income Brackets', subsidy: 'Deduction up to ₹1.5L', maxSubsidy: 'Tax saving up to ₹46.8k' },
        { group: 'Section 24(b) (Interest)', income: 'Self-occupied property', subsidy: 'Deduction up to ₹2.0L', maxSubsidy: 'Tax saving up to ₹62.4k' },
        { group: 'Joint Home Loan Co-borrowers', income: 'Husband & Wife / Co-owners', subsidy: 'Deduction up to ₹3.5L each', maxSubsidy: 'Tax saving up to ₹2.18L' }
      ]
    },
    documents: [
      'Home Loan Provisional Interest & Principal Certificate from Bank',
      'Property Registration & Possession Document',
      'Form 16 / Proof of salary deductions submitted to Employer',
      'ITR filing copy'
    ],
    applicationSteps: [
      'Obtain the Home Loan Interest Certificate from your bank net-banking portal in April/May.',
      'Submit the certificate to your company HR/Finance payroll team for TDS rebate.',
      'Declare principal under 80C and interest under Section 24(b) while filing your annual Income Tax Return.'
    ]
  },

  'pmay-rural': {
    id: 'pmay-rural',
    title: 'PMAY (Rural)',
    fullName: 'Pradhan Mantri Awas Yojana - Gramin (PMAY-G)',
    ministry: 'Ministry of Rural Development, Govt of India',
    badge: 'Affordable Housing',
    theme: 'theme-orange',
    accentColor: '#ea580c',
    categories: ['affordable'],
    summary: 'Flagship rural housing scheme providing direct financial aid and interest subsidy to rural homeless or kutcha-house families.',
    metrics: [
      { label: 'Plain Area Grant', value: '₹1.20 Lakh', sub: '100% Direct Grant' },
      { label: 'Hilly / Special Area', value: '₹1.30 Lakh', sub: 'NE & Himalayan States' },
      { label: 'Interest Subsidy', value: '3.00%', sub: 'on loan up to ₹2 Lakhs' },
      { label: 'MGNREGA Wage Days', value: '90–95 Days', sub: 'Unskilled Labor Aid (~₹18k)' }
    ],
    eligibility: {
      target: 'Rural families listed in SECC 2011 housing deprivation criteria or rural panchayat list.',
      slabs: [
        { group: 'Rural Homeless / Kutcha House', income: 'Rural Household', subsidy: '₹1.20L Grant + ₹12k Toilet aid', maxSubsidy: '₹1.32 Lakh' },
        { group: 'Rural Home Loan Option', income: 'Rural Family', subsidy: '3% Interest Subsidy', maxSubsidy: '₹38,000 on ₹2L' }
      ]
    },
    documents: [
      'Aadhaar Card & MGNREGA Job Card',
      'Bank / Post Office Passbook with DBT linkage',
      'Gram Panchayat resolution or SECC registration number',
      'Geotagged photo of land/old kutcha construction'
    ],
    applicationSteps: [
      'Contact your local Gram Panchayat or Block Development Officer (BDO).',
      'Registration on the AwaasApp portal with geotagged site verification.',
      'Grants are disbursed in 3 direct DBT installments linked to construction stages (plinth, lintel, roof).'
    ]
  },

  'clss': {
    id: 'clss',
    title: 'CLSS',
    fullName: 'Credit Linked Subsidy Scheme for Home Loans',
    ministry: 'Ministry of Housing and Urban Affairs',
    badge: 'Loan & Finance',
    theme: 'theme-purple',
    accentColor: '#7c3aed',
    categories: ['loan-finance', 'affordable', 'first-time'],
    summary: 'Subsidized loan component under PMAY that cuts effective home loan interest rates significantly for eligible buyers.',
    metrics: [
      { label: 'Max Subsidy Credit', value: '₹2.67 Lakh', sub: 'Credited to Loan Account' },
      { label: 'Interest Concession', value: 'Up to 6.50%', sub: 'Net Rate ~2.5% to 5.5%' },
      { label: 'Eligible Loan Tenor', value: 'Up to 20 Yrs', sub: 'NPV Discounted at 9%' },
      { label: 'Max Subsidized Loan', value: '₹6L to ₹12L', sub: 'Over & above can be regular rate' }
    ],
    eligibility: {
      target: 'EWS/LIG/MIG first-time home buyers with adult female co-ownership mandatory for EWS/LIG category.',
      slabs: [
        { group: 'EWS (Up to ₹3 LPA)', income: 'Up to ₹3,00,000', subsidy: '6.5% on ₹6L', maxSubsidy: '₹2.67 Lakh' },
        { group: 'LIG (₹3L to ₹6 LPA)', income: '₹3,00,001 to ₹6,00,000', subsidy: '6.5% on ₹6L', maxSubsidy: '₹2.67 Lakh' },
        { group: 'MIG-I (₹6L to ₹12 LPA)', income: '₹6,00,001 to ₹12,00,000', subsidy: '4.0% on ₹9L', maxSubsidy: '₹2.35 Lakh' },
        { group: 'MIG-II (₹12L to ₹18 LPA)', income: '₹12,00,001 to ₹18,00,000', subsidy: '3.0% on ₹12L', maxSubsidy: '₹2.30 Lakh' }
      ]
    },
    documents: [
      'Self-declaration of first home ownership',
      'PAN, Aadhaar & Voter ID',
      'Salary Slips (3 months) / Form 16',
      'Builder Sale Agreement and approved layout plan'
    ],
    applicationSteps: [
      'Select any primary lending institution (HDFC, SBI, ICICI, PNB Housing, LIC HFL).',
      'Check CLSS box in the home loan application form.',
      'Bank processes CLSS ID via the CNA portal and tracks application online.'
    ]
  },

  'sec-80eea': {
    id: 'sec-80eea',
    title: 'Section 80EEA',
    fullName: 'Additional Tax Deduction on Affordable Housing Loan Interest',
    ministry: 'Central Board of Direct Taxes (CBDT)',
    badge: 'Tax Benefits',
    theme: 'theme-teal',
    accentColor: '#0d9488',
    categories: ['tax-benefits', 'first-time'],
    summary: 'Special ₹1.5 Lakh additional annual tax deduction exclusively for first-time buyers of affordable housing.',
    metrics: [
      { label: 'Additional Deduction', value: '₹1.50 Lakh', sub: 'Over & Above Sec 24(b)' },
      { label: 'Total Interest Shield', value: '₹3.50 Lakh', sub: 'Sec 24(b) + Sec 80EEA' },
      { label: 'Max Stamp Duty Value', value: '₹45 Lakh', sub: 'Property Value Cap' },
      { label: 'Carpet Area Limit', value: '60–90 sq.m', sub: 'Metro vs Non-Metro' }
    ],
    eligibility: {
      target: 'First-time home buyer with property stamp duty valuation up to ₹45 Lakh.',
      slabs: [
        { group: 'Individual First-Time Buyer', income: 'Any bracket', subsidy: '₹1.5L extra deduction', maxSubsidy: '₹46,800 annual tax save' }
      ]
    },
    documents: [
      'Registered Sale Deed reflecting stamp duty value <= ₹45L',
      'Home loan sanction letter',
      'Bank Interest Certificate',
      'Declaration of not owning any other residential house'
    ],
    applicationSteps: [
      'Ensure property agreement stamp value is within ₹45 Lakhs limit.',
      'Obtain bank interest breakup certificate.',
      'Claim ₹2,00,000 under Section 24(b) and remainder up to ₹1,50,000 under Section 80EEA during tax e-filing.'
    ]
  },

  'women-stamp-duty': {
    id: 'women-stamp-duty',
    title: 'Women Stamp Duty Concession',
    fullName: 'State Government Stamp Duty & Registration Rebate for Women',
    ministry: 'State Revenue & Inspector General of Registration (IGR)',
    badge: 'Tax Benefits',
    theme: 'theme-green',
    accentColor: '#15803d',
    categories: ['tax-benefits', 'first-time', 'loan-finance'],
    summary: 'Direct rebate of 1% to 2% on total property stamp duty charges when a female member is sole or joint owner.',
    metrics: [
      { label: 'Stamp Duty Rebate', value: '1.0% – 2.0%', sub: 'Instant Discount on Registration' },
      { label: 'Avg Buyer Savings', value: '₹50k – ₹2 Lakh', sub: 'on ₹50L to ₹1 Cr property' },
      { label: 'Home Loan Concession', value: '0.05% Lower', sub: 'Interest rate discount by top banks' },
      { label: 'Applicable States', value: 'Delhi, MH, UP, HR, RJ, PB', sub: 'Major Indian States' }
    ],
    eligibility: {
      target: 'Any property registered with a woman as sole buyer or first named co-owner.',
      slabs: [
        { group: 'Delhi (NCT)', income: 'All', subsidy: '4.0% vs 6.0% Male (2% Rebate)', maxSubsidy: '₹1.0L on ₹50L' },
        { group: 'Maharashtra', income: 'All', subsidy: '5.0% vs 6.0% Male (1% Rebate)', maxSubsidy: '₹75,000 on ₹75L' },
        { group: 'Uttar Pradesh & Haryana', income: 'All', subsidy: '1% to 2% Concession', maxSubsidy: '₹1.0L on ₹1 Cr' }
      ]
    },
    documents: [
      'Aadhaar / Passport of Female Owner',
      'Sale Deed with Female as First / Joint Party',
      'PAN Card of Female Owner'
    ],
    applicationSteps: [
      'Include the female family member as sole or primary co-owner in the property agreement.',
      'During e-challan generation on the state revenue portal (IGR / StockHolding), select female category.',
      'Discount is automatically calculated on the payment portal before registry.'
    ]
  },

  'state-housing-boards': {
    id: 'state-housing-boards',
    title: 'Housing Board Lottery',
    fullName: 'Subsidized Government Housing Lottery (MHADA, DDA, KHB, CIDCO)',
    ministry: 'State Urban Development Authorities & Housing Boards',
    badge: 'Affordable Housing',
    theme: 'theme-purple',
    accentColor: '#7c3aed',
    categories: ['affordable', 'loan-finance'],
    summary: 'Subsidized high-quality government housing allotments at 20% to 40% discount below prevailing market prices.',
    metrics: [
      { label: 'Price Concession', value: '20% – 40%', sub: 'Below Market Rates' },
      { label: 'Allotment Process', value: 'Draw of Lots', sub: '100% Computerized & Transparent' },
      { label: 'Freehold Clear Title', value: '100% Guaranteed', sub: 'Zero Legal Dispute Risk' },
      { label: 'Financing', value: 'Up to 90% Loan', sub: 'Pre-approved by PSU Banks' }
    ],
    eligibility: {
      target: 'Resident citizens of the respective state with age >= 18 years and income matching category slabs.',
      slabs: [
        { group: 'EWS Flat Allocation', income: 'Up to ₹3.0 Lakh/yr', subsidy: 'Maximum Subsidy', maxSubsidy: '₹15L – ₹25L Total Cost' },
        { group: 'LIG Flat Allocation', income: '₹3.0L to ₹6.0 Lakh/yr', subsidy: 'Subsidized Cost', maxSubsidy: '₹30L – ₹45L Total Cost' },
        { group: 'MIG Flat Allocation', income: '₹6.0L to ₹12.0 Lakh/yr', subsidy: 'Below Market', maxSubsidy: '₹50L – ₹80L Total Cost' }
      ]
    },
    documents: [
      'State Domicile Certificate',
      'Income Certificate issued by Tehsildar / Form 16',
      'Aadhaar Card and PAN Card',
      'Canceled Cheque / Bank details for EMD refund'
    ],
    applicationSteps: [
      'Register on the official housing board portal (e.g., lottery.mhada.gov.in, eservices.dda.org.in).',
      'Fill scheme application and pay Earnest Money Deposit (EMD) via Net Banking.',
      'Watch live computerized draw. If not allotted, EMD is 100% refunded in 15 days.'
    ]
  }
};

// --------------------------------------------------------------------------
// SAVED SCHEMES LOCAL STORAGE STATE
// --------------------------------------------------------------------------
let savedSchemes = [];
try {
  savedSchemes = JSON.parse(localStorage.getItem('yourhome_saved_schemes') || '[]');
} catch (e) {
  savedSchemes = [];
}

// --------------------------------------------------------------------------
// INITIALIZATION ON DOM READY
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initCategoryTabs();
  initSearch();
  initBookmarks();
  initEligibilityWizard();
  updateCategoryCounts();
  updateSavedBadge();
  setupKeyboardAccessibility();
});

// --------------------------------------------------------------------------
// CATEGORY FILTER TABS
// --------------------------------------------------------------------------
function initCategoryTabs() {
  const tabButtons = document.querySelectorAll('.scheme-tab-item');
  const cards = document.querySelectorAll('.scheme-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active tab styling
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const selectedCategory = btn.getAttribute('data-category');
      filterSchemes(selectedCategory, document.getElementById('scheme-search-input').value);
    });
  });
}

function filterSchemes(category = 'all', searchQuery = '') {
  const cards = document.querySelectorAll('.scheme-card');
  const query = (searchQuery || '').trim().toLowerCase();
  let visibleCount = 0;

  cards.forEach((card, index) => {
    const cardCats = (card.getAttribute('data-categories') || '').split(' ');
    const cardId = card.getAttribute('data-id');
    const schemeData = SCHEMES_DATABASE[cardId];

    const matchesCategory = category === 'all' || cardCats.includes(category);
    
    let matchesSearch = true;
    if (query.length > 0 && schemeData) {
      const searchTarget = `${schemeData.title} ${schemeData.fullName} ${schemeData.badge} ${schemeData.summary} ${schemeData.eligibility.target}`.toLowerCase();
      matchesSearch = searchTarget.includes(query);
    }

    if (matchesCategory && matchesSearch) {
      card.style.display = 'flex';
      card.style.animation = `fadeInUp 0.35s ease forwards ${index * 0.05}s`;
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Handle empty search / filter fallback
  let noResultMsg = document.getElementById('schemes-no-results');
  const container = document.getElementById('schemes-cards-container');
  if (visibleCount === 0) {
    if (!noResultMsg) {
      noResultMsg = document.createElement('div');
      noResultMsg.id = 'schemes-no-results';
      noResultMsg.style.gridColumn = '1 / -1';
      noResultMsg.style.textAlign = 'center';
      noResultMsg.style.padding = '3rem 1rem';
      noResultMsg.style.background = '#ffffff';
      noResultMsg.style.borderRadius = '16px';
      noResultMsg.style.border = '1px dashed #cbd5e1';
      noResultMsg.innerHTML = `
        <div style="width:48px; height:48px; border-radius:50%; background:#f1f5f9; color:#64748b; display:inline-flex; align-items:center; justify-content:center; margin-bottom:0.75rem;">
          🔍
        </div>
        <h4 style="font-size:1.1rem; font-weight:700; color:#0f172a; margin-bottom:0.3rem;">No schemes found</h4>
        <p style="font-size:0.85rem; color:#64748b;">Try adjusting your category filter or search keywords.</p>
        <button class="btn-secondary" onclick="resetFilters()" style="margin-top:1rem; font-size:0.8rem; padding:6px 14px;">Reset Filters</button>
      `;
      container.appendChild(noResultMsg);
    }
    noResultMsg.style.display = 'block';
  } else if (noResultMsg) {
    noResultMsg.style.display = 'none';
  }
}

function resetFilters() {
  const searchInput = document.getElementById('scheme-search-input');
  if (searchInput) searchInput.value = '';
  const clearBtn = document.getElementById('search-clear-btn');
  if (clearBtn) clearBtn.classList.remove('visible');

  const allTab = document.querySelector('.scheme-tab-item[data-category="all"]');
  if (allTab) allTab.click();
}

// --------------------------------------------------------------------------
// SEARCH INPUT HANDLING
// --------------------------------------------------------------------------
function initSearch() {
  const searchInput = document.getElementById('scheme-search-input');
  const clearBtn = document.getElementById('search-clear-btn');

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const val = e.target.value;
    if (val.length > 0) {
      clearBtn.classList.add('visible');
    } else {
      clearBtn.classList.remove('visible');
    }

    const activeTab = document.querySelector('.scheme-tab-item.active');
    const category = activeTab ? activeTab.getAttribute('data-category') : 'all';
    filterSchemes(category, val);
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.classList.remove('visible');
    searchInput.focus();
    const activeTab = document.querySelector('.scheme-tab-item.active');
    const category = activeTab ? activeTab.getAttribute('data-category') : 'all';
    filterSchemes(category, '');
  });
}

function updateCategoryCounts() {
  const counts = {
    all: Object.keys(SCHEMES_DATABASE).length,
    'first-time': 0,
    affordable: 0,
    'tax-benefits': 0,
    'loan-finance': 0
  };

  Object.values(SCHEMES_DATABASE).forEach(s => {
    s.categories.forEach(c => {
      if (counts[c] !== undefined) counts[c]++;
    });
  });

  if (document.getElementById('count-all')) document.getElementById('count-all').textContent = counts.all;
  if (document.getElementById('count-first-time')) document.getElementById('count-first-time').textContent = counts['first-time'];
  if (document.getElementById('count-affordable')) document.getElementById('count-affordable').textContent = counts.affordable;
  if (document.getElementById('count-tax-benefits')) document.getElementById('count-tax-benefits').textContent = counts['tax-benefits'];
  if (document.getElementById('count-loan-finance')) document.getElementById('count-loan-finance').textContent = counts['loan-finance'];
}

// --------------------------------------------------------------------------
// SCHEME DETAILS MODAL
// --------------------------------------------------------------------------
function openSchemeDetail(schemeId) {
  const scheme = SCHEMES_DATABASE[schemeId];
  if (!scheme) return;

  const modal = document.getElementById('scheme-details-modal');
  const body = document.getElementById('modal-dynamic-body');
  const isBookmarked = savedSchemes.includes(schemeId);

  body.innerHTML = `
    <!-- Header -->
    <div style="display:flex; align-items:flex-start; gap:14px; margin-bottom:1.25rem; padding-right:30px;">
      <div style="width:48px; height:48px; border-radius:12px; background:${scheme.accentColor}18; color:${scheme.accentColor}; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:1.3rem; font-weight:800;">
        🏛️
      </div>
      <div style="flex:1;">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:2px;">
          <h2 style="font-size:1.35rem; font-weight:800; color:#0f172a; font-family:var(--font-display, sans-serif);">${scheme.title}</h2>
          <span style="font-size:0.72rem; font-weight:700; background:#f1f5f9; color:#475569; padding:2px 8px; border-radius:9999px;">${scheme.badge}</span>
        </div>
        <p style="font-size:0.82rem; color:#64748b; font-weight:600;">${scheme.fullName}</p>
        <span style="font-size:0.74rem; color:#94a3b8;">${scheme.ministry}</span>
      </div>
    </div>

    <!-- Summary Box -->
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:0.85rem 1rem; margin-bottom:1.25rem; font-size:0.85rem; color:#334155; line-height:1.5;">
      ${scheme.summary}
    </div>

    <!-- Key Metrics Grid -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-bottom:1.5rem;">
      ${scheme.metrics.map(m => `
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:0.65rem 0.85rem;">
          <span style="font-size:0.68rem; text-transform:uppercase; color:#64748b; font-weight:600; display:block;">${m.label}</span>
          <strong style="font-size:1.05rem; color:#0f172a; display:block; margin:2px 0;">${m.value}</strong>
          <span style="font-size:0.68rem; color:#94a3b8;">${m.sub}</span>
        </div>
      `).join('')}
    </div>

    <!-- Income & Slabs Table -->
    <h4 style="font-size:0.92rem; font-weight:800; color:#0f172a; margin-bottom:0.6rem;">Eligibility & Slabs Breakdown</h4>
    <div style="border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; margin-bottom:1.5rem;">
      <table style="width:100%; border-collapse:collapse; font-size:0.8rem; text-align:left;">
        <thead>
          <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0; color:#475569;">
            <th style="padding:8px 10px;">Category</th>
            <th style="padding:8px 10px;">Household Income</th>
            <th style="padding:8px 10px;">Benefit Rate</th>
            <th style="padding:8px 10px;">Max Subsidy</th>
          </tr>
        </thead>
        <tbody>
          ${scheme.eligibility.slabs.map(s => `
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:8px 10px; font-weight:600; color:#0f172a;">${s.group}</td>
              <td style="padding:8px 10px; color:#475569;">${s.income}</td>
              <td style="padding:8px 10px; color:#15803d; font-weight:700;">${s.subsidy}</td>
              <td style="padding:8px 10px; color:#0f172a; font-weight:700;">${s.maxSubsidy}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Documents Required -->
    <h4 style="font-size:0.92rem; font-weight:800; color:#0f172a; margin-bottom:0.6rem;">Required Documents Checklist</h4>
    <ul style="list-style:none; display:flex; flex-direction:column; gap:6px; margin-bottom:1.5rem; font-size:0.8rem; color:#475569;">
      ${scheme.documents.map(d => `
        <li style="display:flex; align-items:center; gap:8px;">
          <span style="color:#16a34a; font-size:0.9rem;">✔</span>
          <span>${d}</span>
        </li>
      `).join('')}
    </ul>

    <!-- How to Apply Steps -->
    <h4 style="font-size:0.92rem; font-weight:800; color:#0f172a; margin-bottom:0.6rem;">Step-by-Step Application Process</h4>
    <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:1.75rem;">
      ${scheme.applicationSteps.map((step, idx) => `
        <div style="display:flex; align-items:flex-start; gap:10px; font-size:0.8rem; color:#475569;">
          <span style="width:20px; height:20px; border-radius:50%; background:#f0fdf4; color:#15803d; font-weight:700; display:flex; align-items:center; justify-content:center; font-size:0.7rem; flex-shrink:0;">${idx+1}</span>
          <span style="line-height:1.45;">${step}</span>
        </div>
      `).join('')}
    </div>

    <!-- Modal Footer Actions -->
    <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; border-top:1px solid #e2e8f0; padding-top:1.25rem; flex-wrap:wrap;">
      <button class="btn-secondary" onclick="toggleBookmarkScheme('${schemeId}')" id="modal-bookmark-btn" style="font-size:0.85rem; padding:8px 14px;">
        ${isBookmarked ? '★ Saved to Bookmarks' : '☆ Save Scheme'}
      </button>

      <div style="display:flex; gap:10px;">
        <button class="btn-secondary" onclick="closeSchemeModal()" style="font-size:0.85rem; padding:8px 16px;">
          Close
        </button>
        <button class="btn-primary" onclick="openEligibilityWizard()" style="font-size:0.85rem; padding:8px 18px;">
          Check My Eligibility →
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeSchemeModal() {
  const modal = document.getElementById('scheme-details-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

// --------------------------------------------------------------------------
// ELIGIBILITY CHECKER WIZARD
// --------------------------------------------------------------------------
let wizardState = {
  income: 600000,
  locationType: 'urban',
  isFirstTime: 'yes',
  hasFemaleOwner: 'yes'
};

function initEligibilityWizard() {
  const incomeSlider = document.getElementById('wizard-income-slider');
  const dispIncome = document.getElementById('disp-wizard-income');
  
  if (incomeSlider && dispIncome) {
    incomeSlider.addEventListener('input', (e) => {
      const val = Number(e.target.value);
      wizardState.income = val;
      if (val >= 10000000) {
        dispIncome.textContent = `₹ ${(val / 10000000).toFixed(2)} Cr`;
      } else {
        dispIncome.textContent = `₹ ${(val / 100000).toFixed(2)} Lakhs`;
      }
    });
  }

  // Buttons triggers
  const btnTop = document.getElementById('btn-open-top-eligibility');
  const btnMain = document.getElementById('btn-start-eligibility-wizard');
  const btnClose = document.getElementById('wizard-close-button');
  const modal = document.getElementById('eligibility-wizard-modal');

  if (btnTop) btnTop.addEventListener('click', openEligibilityWizard);
  if (btnMain) btnMain.addEventListener('click', openEligibilityWizard);
  if (btnClose) btnClose.addEventListener('click', closeEligibilityWizard);

  // Close when clicking modal backdrop
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeEligibilityWizard();
    });
  }

  const detailModal = document.getElementById('scheme-details-modal');
  const detailClose = document.getElementById('modal-close-button');
  if (detailClose) detailClose.addEventListener('click', closeSchemeModal);
  if (detailModal) {
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) closeSchemeModal();
    });
  }
}

function openEligibilityWizard() {
  closeSchemeModal();
  const modal = document.getElementById('eligibility-wizard-modal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    goToWizardStep(1);
  }
}

function closeEligibilityWizard() {
  const modal = document.getElementById('eligibility-wizard-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

function selectLocationType(type, element) {
  wizardState.locationType = type;
  element.parentElement.querySelectorAll('.wizard-choice-card').forEach(c => c.classList.remove('selected'));
  element.classList.add('selected');
}

function selectFirstTime(choice, element) {
  wizardState.isFirstTime = choice;
  element.parentElement.querySelectorAll('.wizard-choice-card').forEach(c => c.classList.remove('selected'));
  element.classList.add('selected');
}

function selectFemaleOwner(choice, element) {
  wizardState.hasFemaleOwner = choice;
  element.parentElement.querySelectorAll('.wizard-choice-card').forEach(c => c.classList.remove('selected'));
  element.classList.add('selected');
}

function goToWizardStep(stepNumber) {
  // Hide all step views
  document.getElementById('wizard-step-1').style.display = 'none';
  document.getElementById('wizard-step-2').style.display = 'none';
  document.getElementById('wizard-step-3').style.display = 'none';

  // Update Progress nodes
  for (let i = 1; i <= 3; i++) {
    const node = document.getElementById(`wizard-node-${i}`);
    if (i < stepNumber) {
      node.className = 'wizard-step-node completed';
      node.textContent = '✓';
    } else if (i === stepNumber) {
      node.className = 'wizard-step-node active';
      node.textContent = i;
    } else {
      node.className = 'wizard-step-node';
      node.textContent = i;
    }
  }

  const fill = document.getElementById('wizard-progress-fill');
  if (stepNumber === 1) fill.style.width = '33%';
  else if (stepNumber === 2) fill.style.width = '66%';
  else if (stepNumber === 3) fill.style.width = '100%';

  // Show active step
  const activeView = document.getElementById(`wizard-step-${stepNumber}`);
  if (activeView) activeView.style.display = 'block';

  if (stepNumber === 3) {
    calculateEligibilityResults();
  }
}

function calculateEligibilityResults() {
  const { income, locationType, isFirstTime, hasFemaleOwner } = wizardState;
  const listContainer = document.getElementById('wizard-matched-schemes-list');
  const totalSavingsEl = document.getElementById('wizard-total-savings');
  
  const matched = [];
  let totalSavings = 0;

  // 1. PMAY Urban or Rural
  if (locationType === 'urban' && income <= 1800000 && isFirstTime === 'yes') {
    let subsidy = '₹2,67,000';
    let val = 267000;
    if (income > 1200000) { subsidy = '₹2,30,000'; val = 230000; }
    else if (income > 600000) { subsidy = '₹2,35,000'; val = 235000; }
    
    matched.push({
      title: 'PMAY (Urban) - CLSS Subsidy',
      badge: 'Interest Subsidy',
      benefit: subsidy,
      desc: 'Upfront credit on home loan principal interest subsidy'
    });
    totalSavings += val;
  } else if (locationType === 'rural' && income <= 600000) {
    matched.push({
      title: 'PMAY (Gramin) Direct Assistance',
      badge: 'Direct Grant',
      benefit: '₹1,20,000',
      desc: 'Government financial aid for rural home construction'
    });
    totalSavings += 120000;
  }

  // 2. Home Loan Tax Deductions (Always applicable for borrowers)
  matched.push({
    title: 'Income Tax Act Sec 80C & 24(b)',
    badge: 'Annual Tax Save',
    benefit: '₹1,09,200 / yr',
    desc: 'Deductions on home loan principal (₹1.5L) and interest (₹2.0L)'
  });
  totalSavings += 109200;

  // 3. Section 80EEA (First time affordable buyer)
  if (isFirstTime === 'yes' && income <= 1500000) {
    matched.push({
      title: 'Section 80EEA Extra Deduction',
      badge: 'Tax Benefit',
      benefit: '₹46,800 / yr',
      desc: 'Additional ₹1.5 Lakh interest deduction for affordable housing'
    });
    totalSavings += 46800;
  }

  // 4. Female Stamp Duty Discount
  if (hasFemaleOwner === 'yes') {
    matched.push({
      title: 'Women Stamp Duty Concession',
      badge: 'Registry Discount',
      benefit: '₹75,000 – ₹1.5 Lakh',
      desc: '1% to 2% discount on state stamp duty registration'
    });
    totalSavings += 75000;
  }

  // Render list
  listContainer.innerHTML = matched.map(m => `
    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:0.75rem 1rem; display:flex; align-items:center; justify-content:space-between; gap:12px;">
      <div>
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
          <strong style="font-size:0.88rem; color:#0f172a;">${m.title}</strong>
          <span style="font-size:0.68rem; font-weight:700; background:#f0fdf4; color:#15803d; padding:1px 6px; border-radius:9999px;">${m.badge}</span>
        </div>
        <p style="font-size:0.75rem; color:#64748b;">${m.desc}</p>
      </div>
      <strong style="font-size:0.95rem; color:#15803d; white-space:nowrap;">${m.benefit}</strong>
    </div>
  `).join('');

  totalSavingsEl.textContent = `₹ ${(totalSavings / 100000).toFixed(2)} Lakhs+`;
}

// --------------------------------------------------------------------------
// BOOKMARKS / SAVED SCHEMES
// --------------------------------------------------------------------------
function initBookmarks() {
  const bookmarkBtn = document.getElementById('btn-bookmarks');
  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', () => {
      if (savedSchemes.length === 0) {
        showToast('No saved schemes yet. Click "View Details" to bookmark!');
      } else {
        const firstId = savedSchemes[0];
        openSchemeDetail(firstId);
        showToast(`Showing bookmarked scheme: ${SCHEMES_DATABASE[firstId]?.title || firstId}`);
      }
    });
  }
}

function toggleBookmarkScheme(schemeId) {
  const index = savedSchemes.indexOf(schemeId);
  if (index > -1) {
    savedSchemes.splice(index, 1);
    showToast('Scheme removed from saved list.');
  } else {
    savedSchemes.push(schemeId);
    showToast('Scheme saved to bookmarks!');
  }

  localStorage.setItem('yourhome_saved_schemes', JSON.stringify(savedSchemes));
  updateSavedBadge();

  const modalBtn = document.getElementById('modal-bookmark-btn');
  if (modalBtn) {
    const isBookmarked = savedSchemes.includes(schemeId);
    modalBtn.textContent = isBookmarked ? '★ Saved to Bookmarks' : '☆ Save Scheme';
  }
}

function updateSavedBadge() {
  const badge = document.getElementById('saved-badge');
  if (!badge) return;
  if (savedSchemes.length > 0) {
    badge.textContent = savedSchemes.length;
    badge.style.display = 'inline-flex';
  } else {
    badge.style.display = 'none';
  }
}

// --------------------------------------------------------------------------
// TOAST NOTIFICATIONS & ACCESSIBILITY
// --------------------------------------------------------------------------
function showToast(message) {
  const toast = document.getElementById('schemes-toast');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function setupKeyboardAccessibility() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSchemeModal();
      closeEligibilityWizard();
    }
  });
}
