import React, { useState } from 'react';
import { propertiesData } from '../data/propertiesData';
import { Bookmark, MapPin, Bed, Bath, Maximize, ArrowRight } from 'lucide-react';
import PropertyImageSlider from './PropertyImageSlider';

export default function PropertyBrowse({ bookmarks = [], onToggleBookmark, onSelectProperty }) {
  const [activeTab, setActiveTab] = useState('Buy');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [hoveredCardId, setHoveredCardId] = useState(null);

  const categories = ['Buy', 'Rent', 'Residential', 'Commercial', 'Land'];

  const filteredProperties = propertiesData.filter((prop) => {
    // Filter by tab
    let matchesTab = true;
    if (activeTab === 'Buy') matchesTab = prop.category === 'Buy';
    else if (activeTab === 'Rent') matchesTab = prop.category === 'Rent';
    else if (activeTab === 'Residential') matchesTab = prop.type === 'Residential';
    else if (activeTab === 'Commercial') matchesTab = prop.type === 'Commercial';
    else if (activeTab === 'Land') matchesTab = prop.type === 'Land';

    // Filter by location
    let matchesLoc = true;
    if (selectedLocation !== 'All') {
      const locQuery = selectedLocation.toLowerCase();
      matchesLoc = (prop.city && prop.city.toLowerCase() === locQuery) || 
                 (prop.location && prop.location.toLowerCase().includes(locQuery));
    }

    return matchesTab && matchesLoc;
  });

  return (
    <section className="section-card" id="browse-properties">
      {/* Header with Title & View All */}
      <div className="section-header">
        <h2 className="section-title">Browse Properties</h2>
        <a href="#browse-properties" className="view-all-link">
          View All Properties <ArrowRight size={16} />
        </a>
      </div>

      {/* Category Tabs & Location Select */}
      <div className="browse-header">
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab-btn ${activeTab === cat ? 'active' : ''}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div>
          <select 
            className="location-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="All">📍 Select Location (All)</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Gurugram">Gurugram</option>
            <option value="Greater Noida">Greater Noida</option>
            <option value="Delhi">Delhi</option>
            <option value="Hyderabad">Hyderabad</option>
          </select>
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="properties-grid">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((prop) => {
            const isBookmarked = bookmarks.includes(prop.id);
            const isHovered = hoveredCardId === prop.id;
            const imagesList = prop.images && prop.images.length > 0 ? prop.images : [prop.image];

            return (
              <div 
                key={prop.id} 
                className="property-card"
                onMouseEnter={() => setHoveredCardId(prop.id)}
                onMouseLeave={() => setHoveredCardId(null)}
              >
                {/* Property Image Slider & Badges */}
                <div className="property-img-wrapper">
                  <PropertyImageSlider 
                    images={imagesList} 
                    alt={prop.title} 
                    isHovered={isHovered} 
                  />

                  <span className="property-type-tag" style={{ zIndex: 10 }}>{prop.type}</span>
                  <button
                    className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                    onClick={() => onToggleBookmark(prop.id)}
                    title={isBookmarked ? 'Remove from Saved' : 'Save Property'}
                    style={{ zIndex: 10 }}
                  >
                    <Bookmark size={16} fill={isBookmarked ? '#0F5237' : 'none'} />
                  </button>
                </div>

                {/* Property Content */}
                <div className="property-info">
                  <div className="property-price">{prop.price}</div>
                  <h3 className="property-title">{prop.title}</h3>
                  <div className="property-location">
                    <MapPin size={14} color="#0F5237" />
                    <span>{prop.location}</span>
                  </div>

                  {/* Property Specs */}
                  <div className="property-specs">
                    {prop.beds !== 'Plot' && prop.beds !== 'Office' && (
                      <div className="spec-item">
                        <Bed size={14} />
                        <span>{prop.beds} Beds</span>
                      </div>
                    )}
                    {prop.baths > 0 && (
                      <div className="spec-item">
                        <Bath size={14} />
                        <span>{prop.baths} Baths</span>
                      </div>
                    )}
                    <div className="spec-item">
                      <Maximize size={14} />
                      <span>{prop.sqft}</span>
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="property-card-actions">
                  <button 
                    className="btn-secondary btn-full"
                    onClick={() => onSelectProperty(prop)}
                  >
                    View Details <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            No properties found for selected filters. Try choosing another category or location.
          </div>
        )}
      </div>
    </section>
  );
}
