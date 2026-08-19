import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calculator, 
  CheckCircle2, 
  Home, 
  IndianRupee, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Scale
} from 'lucide-react';

export default function ToolModal({ tool, onClose }) {
  if (!tool) return null;

  // Common State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. EMI Calculator State
  const [emiInput, setEmiInput] = useState({
    loanAmount: 5000000,
    interestRate: 8.5,
    tenureYears: 20
  });
  const [emiData, setEmiData] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);

  // 2. Affordability State
  const [affInput, setAffInput] = useState({
    monthlyIncome: 150000,
    monthlyExpenses: 40000,
    existingEMIs: 15000,
    monthlySavings: 30000,
    downPayment: 1500000
  });
  const [affData, setAffData] = useState(null);

  // 3. True Cost State
  const [tcInput, setTcInput] = useState({
    propertyPrice: 6000000,
    location: 'delhi',
    propertyType: 'residential',
    carpetArea: 1200,
    buyerCategory: 'general'
  });
  const [tcData, setTcData] = useState(null);

  // 4. Rental ROI State
  const [roiInput, setRoiInput] = useState({
    propertyPrice: 6000000,
    totalInvestment: 1500000,
    loanAmount: 4500000,
    interestRate: 8.5,
    tenureYears: 20
  });
  const [roiData, setRoiData] = useState(null);

  // 5. Risk Analyzer State
  const [riskInput, setRiskInput] = useState({
    propertyPrice: 7500000,
    project: 'Green Residency',
    location: 'Sector 67, Gurgaon, Haryana',
    propertyType: 'residential',
    propertyStatus: 'under-construction'
  });
  const [riskData, setRiskData] = useState(null);

  // 6. Stamp Duty State
  const [sdInput, setSdInput] = useState({
    propertyPrice: 5000000,
    location: 'delhi',
    propertyType: 'residential',
    buyerCategory: 'general'
  });
  const [sdData, setSdData] = useState(null);

  // Auto-fetch API data on tool change or input change
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        if (tool.id === 'emi-calc') {
          const res = await fetch('/api/calculate/emi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emiInput)
          });
          const json = await res.json();
          if (active && json.success) setEmiData(json.data);
        } else if (tool.id === 'affordability') {
          const res = await fetch('/api/calculate/affordability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(affInput)
          });
          const json = await res.json();
          if (active && json.success) setAffData(json.data);
        } else if (tool.id === 'true-cost') {
          const res = await fetch('/api/calculate/true-cost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tcInput)
          });
          const json = await res.json();
          if (active && json.success) setTcData(json.data);
        } else if (tool.id === 'rental-roi') {
          const res = await fetch('/api/calculate/rental-roi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(roiInput)
          });
          const json = await res.json();
          if (active && json.success) setRoiData(json.data);
        } else if (tool.id === 'risk-analyzer') {
          const res = await fetch('/api/calculate/risk-analysis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(riskInput)
          });
          const json = await res.json();
          if (active && json.success) setRiskData(json.data);
        } else if (tool.id === 'stamp-duty') {
          const res = await fetch('/api/calculate/true-cost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              propertyPrice: sdInput.propertyPrice,
              location: sdInput.location,
              propertyType: sdInput.propertyType,
              buyerCategory: sdInput.buyerCategory,
              carpetArea: 1000
            })
          });
          const json = await res.json();
          if (active && json.success) setSdData(json.data);
        }
      } catch (err) {
        console.error('API error, using fallback client calculations', err);
        // Fallback calculations if server is unreachable
        if (tool.id === 'emi-calc') {
          const P = emiInput.loanAmount;
          const r = emiInput.interestRate / 12 / 100;
          const n = emiInput.tenureYears * 12;
          const emi = Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
          const totalPay = emi * n;
          const totalInt = totalPay - P;
          if (active) {
            setEmiData({
              monthlyEMI: emi,
              totalPayment: totalPay,
              totalInterest: totalInt,
              principal: P,
              principalPercentage: Number(((P / totalPay) * 100).toFixed(1)),
              interestPercentage: Number(((totalInt / totalPay) * 100).toFixed(1))
            });
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [tool.id, emiInput, affInput, tcInput, roiInput, riskInput, sdInput]);

  const formatLakhs = (val) => {
    if (!val && val !== 0) return '₹ 0';
    if (val >= 10000000) return `₹ ${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹ ${(val / 100000).toFixed(2)} Lakhs`;
    return `₹ ${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              style={{
                width: '42px', height: '42px', borderRadius: '10px',
                background: tool.bg, color: tool.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <Calculator size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '700' }}>{tool.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{tool.description}</p>
            </div>
          </div>

          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Dynamic Calculator Content */}
        <div style={{ marginTop: '16px' }}>

          {/* 1. EMI CALCULATOR */}
          {tool.id === 'emi-calc' && (
            <div>
              <div className="form-group">
                <label className="form-label">
                  Property Loan Amount: <strong>{formatLakhs(emiInput.loanAmount)}</strong>
                </label>
                <input 
                  type="range" 
                  min="1000000" 
                  max="30000000" 
                  step="500000" 
                  value={emiInput.loanAmount} 
                  onChange={(e) => setEmiInput({ ...emiInput, loanAmount: Number(e.target.value) })}
                  className="form-range" 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Interest Rate: <strong>{emiInput.interestRate}%</strong></label>
                  <input 
                    type="range" 
                    min="6" 
                    max="14" 
                    step="0.1" 
                    value={emiInput.interestRate} 
                    onChange={(e) => setEmiInput({ ...emiInput, interestRate: Number(e.target.value) })}
                    className="form-range" 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Loan Tenure: <strong>{emiInput.tenureYears} Years</strong></label>
                  <input 
                    type="range" 
                    min="5" 
                    max="30" 
                    step="1" 
                    value={emiInput.tenureYears} 
                    onChange={(e) => setEmiInput({ ...emiInput, tenureYears: Number(e.target.value) })}
                    className="form-range" 
                  />
                </div>
              </div>

              {emiData && (
                <div className="calc-result-box" style={{ marginTop: '16px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Your Monthly Loan EMI</span>
                  <div className="result-val">₹{emiData.monthlyEMI.toLocaleString('en-IN')}<span style={{ fontSize: '14px', fontWeight: '500' }}>/mo</span></div>
                  
                  {/* Progress Breakdown Bar */}
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <span>Principal Amount ({emiData.principalPercentage}%)</span>
                      <span>Total Interest ({emiData.interestPercentage}%)</span>
                    </div>
                    <div style={{ height: '10px', background: '#E2E8F0', borderRadius: '5px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: `${emiData.principalPercentage}%`, background: '#0F5237' }}></div>
                      <div style={{ width: `${emiData.interestPercentage}%`, background: '#F59E0B' }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px', fontSize: '13px' }}>
                    <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Interest Payable</div>
                      <strong style={{ color: '#D97706' }}>₹{emiData.totalInterest.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Payment Amount</div>
                      <strong style={{ color: '#0F5237' }}>₹{emiData.totalPayment.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  {emiData.schedule && emiData.schedule.length > 0 && (
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                      <button 
                        className="btn-secondary" 
                        onClick={() => setShowSchedule(!showSchedule)}
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        {showSchedule ? <ChevronUp size={14} /> : <ChevronDown size={14} />} 
                        {showSchedule ? 'Hide Amortization Schedule' : 'View Amortization Schedule'}
                      </button>

                      {showSchedule && (
                        <div style={{ marginTop: '12px', maxHeight: '200px', overflowY: 'auto', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                          <table style={{ width: '100%', fontSize: '12px', textIndent: '0', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <th style={{ padding: '8px' }}>Year</th>
                                <th style={{ padding: '8px' }}>Principal</th>
                                <th style={{ padding: '8px' }}>Interest</th>
                                <th style={{ padding: '8px' }}>Balance</th>
                              </tr>
                            </thead>
                            <tbody>
                              {emiData.schedule.map((row) => (
                                <tr key={row.year} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                  <td style={{ padding: '6px 8px' }}>Yr {row.year}</td>
                                  <td style={{ padding: '6px 8px' }}>₹{row.principalPaid.toLocaleString('en-IN')}</td>
                                  <td style={{ padding: '6px 8px' }}>₹{row.interestPaid.toLocaleString('en-IN')}</td>
                                  <td style={{ padding: '6px 8px' }}>₹{row.closingBalance.toLocaleString('en-IN')}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 2. AFFORDABILITY CHECKER */}
          {tool.id === 'affordability' && (
            <div>
              <div className="form-group">
                <label className="form-label">Monthly Household Net Income: <strong>{formatLakhs(affInput.monthlyIncome)}</strong></label>
                <input 
                  type="range" 
                  min="30000" 
                  max="1000000" 
                  step="10000" 
                  value={affInput.monthlyIncome} 
                  onChange={(e) => setAffInput({ ...affInput, monthlyIncome: Number(e.target.value) })}
                  className="form-range" 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Monthly Household Expenses: <strong>{formatLakhs(affInput.monthlyExpenses)}</strong></label>
                  <input 
                    type="range" 
                    min="10000" 
                    max="400000" 
                    step="5000" 
                    value={affInput.monthlyExpenses} 
                    onChange={(e) => setAffInput({ ...affInput, monthlyExpenses: Number(e.target.value) })}
                    className="form-range" 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Existing Monthly EMIs: <strong>{formatLakhs(affInput.existingEMIs)}</strong></label>
                  <input 
                    type="range" 
                    min="0" 
                    max="200000" 
                    step="5000" 
                    value={affInput.existingEMIs} 
                    onChange={(e) => setAffInput({ ...affInput, existingEMIs: Number(e.target.value) })}
                    className="form-range" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Available Down Payment Cash: <strong>{formatLakhs(affInput.downPayment)}</strong></label>
                <input 
                  type="range" 
                  min="200000" 
                  max="10000000" 
                  step="100000" 
                  value={affInput.downPayment} 
                  onChange={(e) => setAffInput({ ...affInput, downPayment: Number(e.target.value) })}
                  className="form-range" 
                />
              </div>

              {affData && (
                <div className="calc-result-box" style={{ marginTop: '16px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Recommended Property Budget Range</span>
                  <div className="result-val" style={{ fontSize: '24px' }}>
                    {affData.affordableRangeFormatted || formatLakhs(affData.maxAffordable)}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px', fontSize: '13px' }}>
                    <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Safe Monthly EMI Limit (32% FOIR)</div>
                      <strong style={{ color: '#0F5237' }}>₹{affData.recommendedEMI.toLocaleString('en-IN')}/mo</strong>
                    </div>
                    <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Max Loan Eligibility</div>
                      <strong style={{ color: '#1D4ED8' }}>{formatLakhs(affData.maxLoanAmount)}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. TRUE COST CALCULATOR */}
          {tool.id === 'true-cost' && (
            <div>
              <div className="form-group">
                <label className="form-label">Base Agreement Property Price: <strong>{formatLakhs(tcInput.propertyPrice)}</strong></label>
                <input 
                  type="range" 
                  min="2000000" 
                  max="50000000" 
                  step="500000" 
                  value={tcInput.propertyPrice} 
                  onChange={(e) => setTcInput({ ...tcInput, propertyPrice: Number(e.target.value) })}
                  className="form-range" 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">State / City</label>
                  <select 
                    value={tcInput.location} 
                    onChange={(e) => setTcInput({ ...tcInput, location: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  >
                    <option value="delhi">Delhi NCR</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="bengaluru">Bengaluru</option>
                    <option value="hyderabad">Hyderabad</option>
                    <option value="chennai">Chennai</option>
                    <option value="pune">Pune</option>
                    <option value="kolkata">Kolkata</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Property Type</label>
                  <select 
                    value={tcInput.propertyType} 
                    onChange={(e) => setTcInput({ ...tcInput, propertyType: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  >
                    <option value="residential">Residential Apartment</option>
                    <option value="commercial">Commercial Space</option>
                    <option value="land">Plot / Land</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Buyer Category</label>
                  <select 
                    value={tcInput.buyerCategory} 
                    onChange={(e) => setTcInput({ ...tcInput, buyerCategory: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  >
                    <option value="general">Male / General</option>
                    <option value="female">Female Buyer (Discount)</option>
                    <option value="senior">Senior Citizen</option>
                  </select>
                </div>
              </div>

              {tcData && tcData.breakup && (
                <div className="calc-result-box" style={{ marginTop: '16px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Estimated True Out-of-Pocket Cost</span>
                  <div className="result-val" style={{ color: '#C2410C' }}>{formatLakhs(tcData.totalTrueCost)}</div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Includes Base Price + Stamp Duty + Reg. Fees + GST + Legal Setup (+{tcData.additionalCostPercentage}% extra)
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px', fontSize: '12px', textAlign: 'left' }}>
                    <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <span>Stamp Duty ({tcData.breakup.stampDuty.rate}%):</span>
                      <strong style={{ display: 'block', color: '#0F5237' }}>₹{tcData.breakup.stampDuty.amount.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <span>Registration ({tcData.breakup.registrationCharges.rate}%):</span>
                      <strong style={{ display: 'block', color: '#1D4ED8' }}>₹{tcData.breakup.registrationCharges.amount.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <span>GST ({tcData.breakup.gst.rate}%):</span>
                      <strong style={{ display: 'block', color: '#6B21A8' }}>₹{tcData.breakup.gst.amount.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <span>Legal & Meter Setup:</span>
                      <strong style={{ display: 'block', color: '#C2410C' }}>₹{tcData.breakup.otherCharges.amount.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. RENTAL ROI CALCULATOR */}
          {tool.id === 'rental-roi' && (
            <div>
              <div className="form-group">
                <label className="form-label">Property Purchase Price: <strong>{formatLakhs(roiInput.propertyPrice)}</strong></label>
                <input 
                  type="range" 
                  min="2000000" 
                  max="50000000" 
                  step="500000" 
                  value={roiInput.propertyPrice} 
                  onChange={(e) => setRoiInput({ ...roiInput, propertyPrice: Number(e.target.value) })}
                  className="form-range" 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Down Payment / Investment: <strong>{formatLakhs(roiInput.totalInvestment)}</strong></label>
                  <input 
                    type="range" 
                    min="500000" 
                    max="20000000" 
                    step="250000" 
                    value={roiInput.totalInvestment} 
                    onChange={(e) => setRoiInput({ ...roiInput, totalInvestment: Number(e.target.value) })}
                    className="form-range" 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Home Loan Amount: <strong>{formatLakhs(roiInput.loanAmount)}</strong></label>
                  <input 
                    type="range" 
                    min="0" 
                    max="30000000" 
                    step="500000" 
                    value={roiInput.loanAmount} 
                    onChange={(e) => setRoiInput({ ...roiInput, loanAmount: Number(e.target.value) })}
                    className="form-range" 
                  />
                </div>
              </div>

              {roiData && (
                <div className="calc-result-box" style={{ marginTop: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', textAlign: 'center' }}>
                    <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Gross Rental Yield</span>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: '#6B21A8' }}>{roiData.grossRentalYield}%</div>
                    </div>
                    <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Net Yield (After Exp)</span>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: '#0F5237' }}>{roiData.netRentalYield}%</div>
                    </div>
                    <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cash-on-Cash ROI</span>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: '#1D4ED8' }}>{roiData.cashOnCashReturn}%</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', fontSize: '13px', textAlign: 'left', background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span>Estimated Monthly Rent:</span>
                      <strong>₹{roiData.monthlyRent.toLocaleString('en-IN')}/mo</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span>Payback Period:</span>
                      <strong>{roiData.paybackYears} Years</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Net Annual Cashflow:</span>
                      <strong style={{ color: roiData.netAnnualRentalIncome >= 0 ? '#0F5237' : '#DC2626' }}>
                        ₹{roiData.netAnnualRentalIncome.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. RISK ANALYZER */}
          {tool.id === 'risk-analyzer' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Property Price: <strong>{formatLakhs(riskInput.propertyPrice)}</strong></label>
                  <input 
                    type="range" 
                    min="2000000" 
                    max="30000000" 
                    step="500000" 
                    value={riskInput.propertyPrice} 
                    onChange={(e) => setRiskInput({ ...riskInput, propertyPrice: Number(e.target.value) })}
                    className="form-range" 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Construction Status</label>
                  <select 
                    value={riskInput.propertyStatus} 
                    onChange={(e) => setRiskInput({ ...riskInput, propertyStatus: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  >
                    <option value="under-construction">Under Construction</option>
                    <option value="ready-to-move">Ready to Move</option>
                    <option value="new-launch">Pre-Launch / New Launch</option>
                  </select>
                </div>
              </div>

              {riskData && (
                <div className="calc-result-box" style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Overall Risk Index Score</span>
                      <div style={{ fontSize: '28px', fontWeight: '800', color: riskData.overallScore > 60 ? '#D97706' : '#0F5237' }}>
                        {riskData.overallScore} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/ 100</span>
                      </div>
                    </div>

                    <span style={{
                      padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700',
                      background: riskData.overallScore > 60 ? '#FEF3C7' : '#DCFCE7',
                      color: riskData.overallScore > 60 ? '#B45309' : '#0F5237'
                    }}>
                      {riskData.overallLevel}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'left' }}>
                    {riskData.summary}
                  </p>

                  {riskData.recommendations && (
                    <div style={{ marginTop: '14px', textAlign: 'left', background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: '#0F5237' }}>
                        Expert Recommendations:
                      </div>
                      {riskData.recommendations.slice(0, 3).map((rec, i) => (
                        <div key={i} style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={14} color="#0F5237" /> {rec.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 6. STAMP DUTY CALCULATOR */}
          {tool.id === 'stamp-duty' && (
            <div>
              <div className="form-group">
                <label className="form-label">Property Value: <strong>{formatLakhs(sdInput.propertyPrice)}</strong></label>
                <input 
                  type="range" 
                  min="1000000" 
                  max="40000000" 
                  step="500000" 
                  value={sdInput.propertyPrice} 
                  onChange={(e) => setSdInput({ ...sdInput, propertyPrice: Number(e.target.value) })}
                  className="form-range" 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">State / Region</label>
                  <select 
                    value={sdInput.location} 
                    onChange={(e) => setSdInput({ ...sdInput, location: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  >
                    <option value="delhi">Delhi NCR (6% General / 4% Women)</option>
                    <option value="mumbai">Mumbai, Maharashtra (6% Gen / 5% Women)</option>
                    <option value="bengaluru">Bengaluru, Karnataka (5%)</option>
                    <option value="hyderabad">Hyderabad, Telangana (6%)</option>
                    <option value="chennai">Chennai, Tamil Nadu (7%)</option>
                    <option value="pune">Pune, Maharashtra (6%)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Buyer</label>
                  <select 
                    value={sdInput.buyerCategory} 
                    onChange={(e) => setSdInput({ ...sdInput, buyerCategory: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  >
                    <option value="general">Male / General</option>
                    <option value="female">Female Buyer (State Concession)</option>
                    <option value="senior">Senior Citizen</option>
                  </select>
                </div>
              </div>

              {sdData && sdData.breakup && (
                <div className="calc-result-box" style={{ marginTop: '16px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Total Govt Statutory & Stamp Duty Charges</span>
                  <div className="result-val" style={{ color: '#B45309' }}>
                    ₹{(sdData.breakup.stampDuty.amount + sdData.breakup.registrationCharges.amount).toLocaleString('en-IN')}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px', fontSize: '13px', textAlign: 'left' }}>
                    <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>State Stamp Duty ({sdData.breakup.stampDuty.rate}%)</div>
                      <strong style={{ color: '#0F5237', fontSize: '16px' }}>₹{sdData.breakup.stampDuty.amount.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Registration Charges ({sdData.breakup.registrationCharges.rate}%)</div>
                      <strong style={{ color: '#1D4ED8', fontSize: '16px' }}>₹{sdData.breakup.registrationCharges.amount.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Actions Footer */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={14} color="#0F5237" /> Powered by Your Home Financial Engine
          </div>

          <button className="btn-primary" onClick={onClose}>
            Done & Close
          </button>
        </div>
      </div>
    </div>
  );
}
