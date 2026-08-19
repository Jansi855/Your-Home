import React, { useState } from 'react';
import { X, MapPin, Bed, Bath, Maximize, Check, Phone, ShieldCheck, Heart } from 'lucide-react';

export default function PropertyModal({ property, onClose, isBookmarked, onToggleBookmark }) {
  const [contactSuccess, setContactSuccess] = useState(false);

  if (!property) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <span style={{
              background: 'var(--primary-emerald-light)', color: 'var(--primary-emerald)',
              fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase'
            }}>
              {property.type}
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginTop: '6px' }}>{property.title}</h3>
          </div>

          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '100%', height: '260px', borderRadius: '16px', overflow: 'hidden' }}>
            <img src={property.image} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary-emerald)' }}>
                {property.price}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} color="#0F5237" /> {property.location}
              </div>
            </div>

            <button 
              className="btn-secondary" 
              onClick={() => onToggleBookmark(property.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Heart size={16} fill={isBookmarked ? '#0F5237' : 'none'} color="#0F5237" />
              {isBookmarked ? 'Saved' : 'Save'}
            </button>
          </div>

          {/* Key Features / Specs */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px',
            background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bed size={18} color="#0F5237" />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bedrooms</div>
                <div style={{ fontSize: '14px', fontWeight: '700' }}>{property.beds}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bath size={18} color="#0F5237" />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bathrooms</div>
                <div style={{ fontSize: '14px', fontWeight: '700' }}>{property.baths}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Maximize size={18} color="#0F5237" />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Super Area</div>
                <div style={{ fontSize: '14px', fontWeight: '700' }}>{property.sqft}</div>
              </div>
            </div>
          </div>

          {/* Financial Recommendation Badge */}
          <div style={{
            background: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: '12px', padding: '14px',
            display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <ShieldCheck size={24} color="#0F5237" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F5237' }}>
                Your Home Risk Rating: 9.2/10 (High Investment Confidence)
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Estimated EMI: {property.estEMI} | Clear Title Verified by Financial Experts
              </div>
            </div>
          </div>

          {/* Contact Form */}
          {contactSuccess ? (
            <div style={{ background: 'var(--primary-emerald-light)', padding: '16px', borderRadius: '12px', textAlign: 'center', color: 'var(--primary-emerald)', fontWeight: '700' }}>
              <Check size={20} style={{ display: 'inline', marginRight: '6px' }} />
              Agent contacted! We will reach out to you within 15 minutes.
            </div>
          ) : (
            <button className="btn-primary btn-full" onClick={() => setContactSuccess(true)}>
              <Phone size={16} /> Contact Verified Agent Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
