import React, { useState } from 'react';
import { Home, Bookmark, User, ChevronDown, Menu, X } from 'lucide-react';

export default function Navbar({ bookmarkCount = 0, onOpenBookmarks, onOpenUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <nav className="navbar-sticky">
      {/* Brand Logo */}
      <div className="navbar-brand">
        <div className="brand-icon">
          <Home size={22} color="#0F5237" />
        </div>
        <div className="brand-info">
          <span className="brand-title">Your Home</span>
          <span className="brand-subtitle">Plan • Analyze • Invest</span>
        </div>
      </div>

      {/* Nav Links Desktop */}
      <ul className="nav-menu">
        <li>
          <a href="#home" className="nav-link active">
            Home
          </a>
        </li>

        {/* Calculators Dropdown */}
        <li style={{ position: 'relative' }}>
          <button 
            className="nav-link" 
            onClick={() => toggleDropdown('calculators')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Calculators <ChevronDown size={14} />
          </button>
          {activeDropdown === 'calculators' && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, background: '#ffffff',
              boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-md)', padding: '10px 0',
              minWidth: '200px', zIndex: 100, border: '1px solid var(--border-color)', marginTop: '8px'
            }}>
              <a href="/emi-calculator" className="nav-link" style={{ padding: '8px 16px' }}>EMI Calculator</a>
              <a href="/affordability" className="nav-link" style={{ padding: '8px 16px' }}>Affordability Checker</a>
              <a href="/true-cost" className="nav-link" style={{ padding: '8px 16px' }}>True Cost Calculator</a>
              <a href="/rental-roi" className="nav-link" style={{ padding: '8px 16px' }}>Rental ROI Calculator</a>
              <a href="/buy-vs-rent" className="nav-link" style={{ padding: '8px 16px' }}>Buy vs Rent Calculator</a>
            </div>
          )}
        </li>

        {/* Property Dropdown */}
        <li style={{ position: 'relative' }}>
          <button 
            className="nav-link" 
            onClick={() => toggleDropdown('property')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Property <ChevronDown size={14} />
          </button>
          {activeDropdown === 'property' && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, background: '#ffffff',
              boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-md)', padding: '10px 0',
              minWidth: '180px', zIndex: 100, border: '1px solid var(--border-color)', marginTop: '8px'
            }}>
              <a href="#browse-properties" className="nav-link" style={{ padding: '8px 16px' }}>Buy Properties</a>
              <a href="#browse-properties" className="nav-link" style={{ padding: '8px 16px' }}>Rent Properties</a>
              <a href="#browse-properties" className="nav-link" style={{ padding: '8px 16px' }}>Commercial Space</a>
              <a href="#browse-properties" className="nav-link" style={{ padding: '8px 16px' }}>Plots & Land</a>
            </div>
          )}
        </li>

        <li>
          <a href="#insights" className="nav-link">Insights</a>
        </li>

        <li>
          <a href="#schemes" className="nav-link">Schemes</a>
        </li>

        {/* Tools Dropdown */}
        <li style={{ position: 'relative' }}>
          <button 
            className="nav-link" 
            onClick={() => toggleDropdown('tools')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Tools <ChevronDown size={14} />
          </button>
          {activeDropdown === 'tools' && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, background: '#ffffff',
              boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-md)', padding: '10px 0',
              minWidth: '180px', zIndex: 100, border: '1px solid var(--border-color)', marginTop: '8px'
            }}>
              <a href="/risk-analysis" className="nav-link" style={{ padding: '8px 16px' }}>Risk Analyzer</a>
              <a href="/true-cost" className="nav-link" style={{ padding: '8px 16px' }}>Stamp Duty Calc</a>
              <a href="/tools" className="nav-link" style={{ padding: '8px 16px' }}>All Tools Directory</a>
            </div>
          )}
        </li>

        <li>
          <a href="/about-us" className="nav-link">About Us</a>
        </li>
      </ul>

      {/* Action Icons Right */}
      <div className="nav-actions">
        <button 
          className="icon-btn" 
          aria-label="Bookmarks"
          onClick={onOpenBookmarks}
          title="Saved Properties"
        >
          <Bookmark size={18} />
          {bookmarkCount > 0 && <span className="badge-count">{bookmarkCount}</span>}
        </button>

        <button 
          className="icon-btn" 
          aria-label="User Account"
          onClick={onOpenUser}
          title="User Account"
        >
          <User size={18} />
        </button>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="icon-btn mobile-toggle" 
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: '#ffffff', border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)', padding: '20px', marginTop: '10px',
          boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', gap: '12px'
        }}>
          <a href="#home" className="nav-link active" onClick={() => setMobileOpen(false)}>Home</a>
          <a href="#popular-tools" className="nav-link" onClick={() => setMobileOpen(false)}>Calculators</a>
          <a href="#browse-properties" className="nav-link" onClick={() => setMobileOpen(false)}>Property</a>
          <a href="#insights" className="nav-link" onClick={() => setMobileOpen(false)}>Insights</a>
          <a href="#schemes" className="nav-link" onClick={() => setMobileOpen(false)}>Schemes</a>
          <a href="#popular-tools" className="nav-link" onClick={() => setMobileOpen(false)}>Tools</a>
          <a href="#about-us" className="nav-link" onClick={() => setMobileOpen(false)}>About Us</a>
        </div>
      )}
    </nav>
  );
}
