import React from 'react';
import { ArrowRight, Home as HomeIcon } from 'lucide-react';

export default function FutureHomeCTA({ onGetStarted }) {
  return (
    <section className="future-cta-banner">
      <div className="future-cta-left">
        {/* SVG/Illustration representing family & home */}
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: '#0F5237',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 20px rgba(15, 82, 55, 0.2)',
          flexShrink: 0
        }}>
          <HomeIcon size={36} />
        </div>

        <div className="future-cta-text">
          <h2 className="future-cta-title">Let’s Plan Your Future Home</h2>
          <p className="future-cta-sub">
            Answer a few simple questions and we’ll show you your affordable budget, best locations and suitable properties.
          </p>
        </div>
      </div>

      <div className="future-cta-right">
        <button className="btn-primary" onClick={onGetStarted}>
          Get Started <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
