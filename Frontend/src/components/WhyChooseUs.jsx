import React from 'react';
import { benefitsData } from '../data/toolsData';
import { UserCheck, Target, Clock, Shield } from 'lucide-react';

const benefitIcons = {
  UserCheck: UserCheck,
  Target: Target,
  Clock: Clock,
  Shield: Shield
};

export default function WhyChooseUs() {
  return (
    <section className="section-card why-choose-container" id="about-us">
      <h2 className="why-choose-title">Why Choose Your Home?</h2>

      <div className="benefits-grid">
        {benefitsData.map((item) => {
          const IconComponent = benefitIcons[item.icon] || Shield;
          return (
            <div key={item.id} className="benefit-card">
              <div className="benefit-icon">
                <IconComponent size={22} color="#0F5237" />
              </div>
              <div className="benefit-content">
                <h3 className="benefit-title">{item.title}</h3>
                <p className="benefit-desc">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
