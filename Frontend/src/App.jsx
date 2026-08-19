import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PopularTools from './components/PopularTools';
import WhyChooseUs from './components/WhyChooseUs';
import FutureHomeCTA from './components/FutureHomeCTA';
import PropertyBrowse from './components/PropertyBrowse';
import Footer from './components/Footer';
import ToolModal from './components/ToolModal';
import PropertyModal from './components/PropertyModal';
import { toolsData } from './data/toolsData';

export default function App() {
  // Saved properties state
  const [bookmarks, setBookmarks] = useState(['prop-1']); // default 1 saved
  // Active modals state
  const [activeTool, setActiveTool] = useState(null);
  const [activeProperty, setActiveProperty] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Toggle bookmarking
  const handleToggleBookmark = (id) => {
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter((item) => item !== id));
      showToast('Property removed from bookmarks');
    } else {
      setBookmarks([...bookmarks, id]);
      showToast('Property saved to bookmarks!');
    }
  };

  // Open Affordability Modal directly
  const handleOpenAffordability = () => {
    const affTool = toolsData.find((t) => t.id === 'affordability');
    setActiveTool(affTool || toolsData[0]);
  };

  // Toast notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 3000,
          background: '#0F5237', color: '#ffffff', padding: '12px 20px',
          borderRadius: '12px', fontSize: '14px', fontWeight: '600',
          boxShadow: '0 10px 25px rgba(15, 82, 55, 0.3)', animation: 'fadeIn 0.2s ease'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Reusable Navbar */}
      <Navbar 
        bookmarkCount={bookmarks.length} 
        onOpenBookmarks={() => {
          const section = document.getElementById('browse-properties');
          if (section) section.scrollIntoView({ behavior: 'smooth' });
          showToast(`You have ${bookmarks.length} saved property item(s).`);
        }}
        onOpenUser={() => showToast('User Profile logged in as Investor')}
      />

      {/* Main Sections Wrapper */}
      <main className="content-wrapper">
        {/* 1. Hero Section */}
        <Hero onOpenAffordability={handleOpenAffordability} />

        {/* 2. Popular Tools Section */}
        <PopularTools onSelectTool={(tool) => setActiveTool(tool)} />

        {/* 3. Why Choose Your Home? Section */}
        <WhyChooseUs />

        {/* 4. Future Home CTA Banner */}
        <FutureHomeCTA onGetStarted={handleOpenAffordability} />

        {/* 5. Browse Properties Section */}
        <PropertyBrowse 
          bookmarks={bookmarks}
          onToggleBookmark={handleToggleBookmark}
          onSelectProperty={(prop) => setActiveProperty(prop)}
        />

        {/* Footer */}
        <Footer />
      </main>

      {/* Calculator Modal */}
      {activeTool && (
        <ToolModal tool={activeTool} onClose={() => setActiveTool(null)} />
      )}

      {/* Property Quick Detail Modal */}
      {activeProperty && (
        <PropertyModal 
          property={activeProperty} 
          onClose={() => setActiveProperty(null)}
          isBookmarked={bookmarks.includes(activeProperty.id)}
          onToggleBookmark={handleToggleBookmark}
        />
      )}
    </div>
  );
}
