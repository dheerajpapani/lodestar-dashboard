// src/components/NavbarSearch.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes, FaGlobe, FaPhoneAlt, FaMapMarkerAlt, FaFileAlt, FaExclamationTriangle } from 'react-icons/fa';
import '../App.css';

const searchIndex = [
  // Pages
  { type: 'page', title: 'Home Dashboard', path: '/', category: 'Page', icon: <FaGlobe /> },
  { type: 'page', title: 'About LODESTAR', path: '/about', category: 'Page', icon: <FaFileAlt /> },
  { type: 'page', title: 'Interactive Maps', path: '/maps', category: 'Page', icon: <FaMapMarkerAlt /> },
  { type: 'page', title: 'Early Warning Alerts', path: '/alerts', category: 'Page', icon: <FaExclamationTriangle /> },
  { type: 'page', title: 'Disaster Emergency Contacts', path: '/emergency-contacts', category: 'Page', icon: <FaPhoneAlt /> },
  { type: 'page', title: 'Living Labs', path: '/living-labs', category: 'Page', icon: <FaFileAlt /> },
  { type: 'page', title: 'Serious Games', path: '/serious-games', category: 'Page', icon: <FaFileAlt /> },
  { type: 'page', title: 'Research Publications', path: '/research', category: 'Page', icon: <FaFileAlt /> },
  { type: 'page', title: 'Project Team', path: '/team', category: 'Page', icon: <FaFileAlt /> },

  // Emergency Contacts
  { type: 'contact', title: 'BBMP Flood Control (Bengaluru)', number: '080-22660000', link: 'tel:08022660000', category: 'Helpline', icon: <FaPhoneAlt /> },
  { type: 'contact', title: 'NDRF Control Room (Guwahati)', number: '0361-2840284', link: 'tel:03612840284', category: 'Helpline', icon: <FaPhoneAlt /> },
  { type: 'contact', title: 'Assam Disaster Mgmt (SDMA)', number: '1077 / 1070', link: 'tel:1070', category: 'Helpline', icon: <FaPhoneAlt /> },
  { type: 'contact', title: 'DDMA Kamrup Metropolitan', number: '96784-71071', link: 'tel:9678471071', category: 'Helpline', icon: <FaPhoneAlt /> },
  { type: 'contact', title: 'AP Disaster Helpline (Anantapur)', number: '1070', link: 'tel:1070', category: 'Helpline', icon: <FaPhoneAlt /> },
  { type: 'contact', title: 'Rijkswaterstaat Flood Info (NL)', number: '0800-8002', link: 'tel:08008002', category: 'Helpline', icon: <FaPhoneAlt /> },

  // Study Sites
  { type: 'site', title: 'Guwahati Study Site (Assam)', path: '/emergency-contacts', category: 'Study Site', icon: <FaMapMarkerAlt /> },
  { type: 'site', title: 'Bengaluru Study Site (Karnataka)', path: '/emergency-contacts', category: 'Study Site', icon: <FaMapMarkerAlt /> },
  { type: 'site', title: 'Anantapur Study Site (Andhra Pradesh)', path: '/emergency-contacts', category: 'Study Site', icon: <FaMapMarkerAlt /> },
  { type: 'site', title: 'Netherlands Study Sites (EU)', path: '/emergency-contacts', category: 'Study Site', icon: <FaMapMarkerAlt /> }
];

export default function NavbarSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const filteredResults = query.trim()
    ? searchIndex.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          (item.number && item.number.includes(query))
      )
    : searchIndex.slice(0, 6); // Show top default options

  const handleSelect = (item) => {
    setIsOpen(false);
    if (item.link) {
      window.location.href = item.link;
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <>
      {/* Navbar Trigger Button */}
      <button 
        className="nav-search-trigger"
        onClick={() => setIsOpen(true)}
        title="Search LODESTAR (Ctrl + K)"
        aria-label="Search"
      >
        <FaSearch className="nav-search-icon" />
        <span className="nav-search-placeholder">Search...</span>
        <kbd className="nav-search-kbd">Ctrl K</kbd>
      </button>

      {/* Spotlight Search Overlay */}
      {isOpen && (
        <div className="search-modal-backdrop" onClick={() => setIsOpen(false)}>
          <div className="search-modal-container" onClick={(e) => e.stopPropagation()}>
            {/* Input Header */}
            <div className="search-modal-header">
              <FaSearch className="search-modal-icon" />
              <input
                ref={inputRef}
                type="text"
                className="search-modal-input"
                placeholder="Search pages, emergency helplines, study sites..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="search-modal-close" onClick={() => setIsOpen(false)}>
                <FaTimes />
              </button>
            </div>

            {/* Results List */}
            <div className="search-modal-results">
              {filteredResults.length > 0 ? (
                filteredResults.map((item, index) => (
                  <div
                    key={index}
                    className="search-result-item"
                    onClick={() => handleSelect(item)}
                  >
                    <span className="result-item-icon">{item.icon}</span>
                    <div className="result-item-info">
                      <span className="result-item-title">{item.title}</span>
                      {item.number && (
                        <span className="result-item-sub">{item.number}</span>
                      )}
                    </div>
                    <span className={`result-item-badge ${item.type}`}>
                      {item.category}
                    </span>
                  </div>
                ))
              ) : (
                <div className="search-no-results">
                  No matching results found for "{query}"
                </div>
              )}
            </div>

            {/* Footer Tip */}
            <div className="search-modal-footer">
              <span>Press <kbd>ESC</kbd> to exit</span>
              <span>LODESTAR Global Search</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
