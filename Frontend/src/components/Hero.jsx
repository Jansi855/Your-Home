import React from 'react';
import { ArrowRight, Calculator, Check } from 'lucide-react';
import heroImg from '../assets/hero_building.png';

export default function Hero({ onOpenAffordability }) {
  const smartFeatures = [
    'Know True Property Cost',
    'Check Loan & Affordability',
    'Analyze Risk & Returns',
    'Explore Govt. Benefits',
    'Get Clear Recommendation'
  ];

  return (
    <section className="section-card hero-section" id="home">
      <div className="hero-container">
        {/* Left Hero Column */}
        <div className="hero-left">
          <h1 className="hero-title">
            Make Every <br />
            Property Decision <br />
            the <span className="highlight">Right One.</span>
          </h1>

          <p className="hero-subtitle">
            Your Home helps you plan, analyze and invest in real estate with confidence using smart tools and real insights.
          </p>

          {/* Action CTAs */}
          <div className="hero-actions">
            <a href="#browse-properties" className="btn-primary">
              Explore Properties <ArrowRight size={16} />
            </a>

            <button className="btn-secondary" onClick={onOpenAffordability}>
              Check Affordability <Calculator size={16} />
            </button>
          </div>

          {/* Trust Badge */}
          <div className="trust-badge">
            <div className="avatar-group">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" 
                alt="User Avatar" 
                className="avatar-img" 
              />
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" 
                alt="User Avatar" 
                className="avatar-img" 
              />
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" 
                alt="User Avatar" 
                className="avatar-img" 
              />
            </div>
            <div className="trust-text">
              <span className="trust-title">Trusted by 5,000+ users</span>
              <span className="trust-sub">for smarter real estate decisions</span>
            </div>
          </div>
        </div>

        {/* Right Hero Column with Floating Card */}
        <div className="hero-right">
          <div className="hero-img-wrapper">
            <img 
              src={heroImg} 
              alt="Premium Residential Property" 
              className="hero-main-img" 
            />
          </div>

          {/* Floating "Smart Decision Starts Here" Card */}
          <div className="floating-smart-card">
            <h4 className="smart-card-title">Smart Decision Starts Here</h4>

            <div className="smart-list">
              {smartFeatures.map((feat, idx) => (
                <div key={idx} className="smart-item">
                  <div className="check-icon">
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="smart-pill">
              <div className="pill-text">Buy • Wait • Avoid</div>
              <div className="pill-sub">Make the right move with clarity.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
