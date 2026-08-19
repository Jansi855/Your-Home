import React, { useState } from 'react';
import { Home as HomeIcon, Send, Check } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer style={{
      background: '#ffffff',
      borderRadius: 'var(--radius-xl)',
      padding: '40px 36px 24px',
      marginTop: '32px',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr',
        gap: '32px',
        marginBottom: '32px'
      }}>
        {/* Col 1: Brand Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="navbar-brand">
            <div className="brand-icon">
              <HomeIcon size={22} color="#0F5237" />
            </div>
            <div className="brand-info">
              <span className="brand-title">Your Home</span>
              <span className="brand-subtitle">Plan • Analyze • Invest</span>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '280px' }}>
            Empowering property buyers and investors with intelligent financial planning, loan calculators, and market insights.
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px', color: 'var(--text-main)' }}>Platform</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <li><a href="#home">Home</a></li>
            <li><a href="#popular-tools">Calculators</a></li>
            <li><a href="#browse-properties">Browse Properties</a></li>
            <li><a href="#about-us">Why Choose Us</a></li>
          </ul>
        </div>

        {/* Col 3: Popular Tools */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px', color: 'var(--text-main)' }}>Calculators</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <li><a href="#popular-tools">EMI Calculator</a></li>
            <li><a href="#popular-tools">Affordability Checker</a></li>
            <li><a href="#popular-tools">True Cost Calculator</a></li>
            <li><a href="#popular-tools">Rental ROI Calculator</a></li>
          </ul>
        </div>

        {/* Col 4: Newsletter */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px', color: 'var(--text-main)' }}>Stay Informed</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Get monthly market insights and government housing policy updates.
          </p>
          {subscribed ? (
            <div style={{ fontSize: '12px', color: 'var(--primary-emerald)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} /> Subscribed to Insights!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '6px' }}>
              <input 
                type="email" 
                placeholder="Enter email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '12px',
                  outline: 'none',
                  flexGrow: 1
                }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '8px 14px' }}>
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      <div style={{
        paddingTop: '20px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: 'var(--text-muted)'
      }}>
        <span>© 2026 Your Home. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#security">Security</a>
        </div>
      </div>
    </footer>
  );
}
