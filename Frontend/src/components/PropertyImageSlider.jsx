import React, { useState, useEffect } from 'react';

export default function PropertyImageSlider({ images = [], alt = '', isHovered = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no images array provided or single image, fallback gracefully
  const imageList = Array.isArray(images) && images.length > 0 ? images : [];

  useEffect(() => {
    if (imageList.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageList.length);
    }, 3000); // rotate every 3 seconds

    return () => clearInterval(timer);
  }, [imageList.length, isHovered]);

  if (imageList.length === 0) return null;

  return (
    <div className="property-slider-container" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {imageList.map((imgSrc, idx) => {
        const isActive = idx === currentIndex;
        return (
          <img
            key={idx}
            src={imgSrc}
            alt={`${alt} - view ${idx + 1}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'scale(1)' : 'scale(1.06)',
              transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: isActive ? 1 : 0,
              pointerEvents: 'none'
            }}
          />
        );
      })}

      {/* Subtle indicator dots */}
      {imageList.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '12px',
          zIndex: 5,
          display: 'flex',
          gap: '5px',
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '4px 8px',
          borderRadius: '12px',
          backdropFilter: 'blur(4px)'
        }}>
          {imageList.map((_, idx) => (
            <span
              key={idx}
              style={{
                width: idx === currentIndex ? '14px' : '5px',
                height: '5px',
                borderRadius: '3px',
                background: idx === currentIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
