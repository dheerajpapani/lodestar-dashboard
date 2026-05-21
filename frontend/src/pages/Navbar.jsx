// src/pages/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../components/ThemeToggle.jsx';
import '../App.css';

// SVG Lock Icon component
const LockIcon = ({ size = 16, style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'assamese', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'bengali', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'bihari', name: 'Bihari', nativeName: 'भोजपुरी/मैथिली' },
  { code: 'dutch', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'hindi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'morrocan', name: 'Morrocan', nativeName: 'الدارجة المغربية' },
  { code: 'telugu', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'turkish', name: 'Turkish', nativeName: 'Türkçe' }
];

// SVG Translate/Languages Icon component
const TranslateIcon = ({ size = 16, style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <path d="m5 8 6 6" />
    <path d="m4 14 6-6 2-3" />
    <path d="M2 5h12" />
    <path d="M7 2h1" />
    <path d="m22 22-5-10-5 10" />
    <path d="M14 18h6" />
  </svg>
);

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lodestar_lang', code);
    setIsOpen(false);
  };

  return (
    <div className="lang-switcher-container" ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lang-switcher-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: '20px',
          border: '1px solid var(--border-color, rgba(255, 255, 255, 0.15))',
          background: 'var(--bg-light, rgba(255, 255, 255, 0.08))',
          color: 'var(--text-main, inherit)',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          outline: 'none',
          boxShadow: '0 2px 6px var(--shadow-color)'
        }}
        title="Switch language"
      >
        <TranslateIcon size={16} style={{ opacity: 0.85 }} />
        <span>{currentLang.name}</span>
        <span style={{ fontSize: '9px', opacity: 0.7, transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
      </button>

      {isOpen && (
        <ul
          className="lang-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: 'var(--bg-light, #ffffff)',
            border: '1px solid var(--border-color, #dee2e6)',
            borderRadius: '12px',
            boxShadow: '0 8px 30px var(--shadow-color)',
            padding: '6px 0',
            margin: 0,
            listStyle: 'none',
            minWidth: '200px',
            zIndex: 1000,
            maxHeight: '300px',
            overflowY: 'auto'
          }}
        >
          {/* Default/Primary English Option at top */}
          <li key="en">
            <button
              onClick={() => handleLanguageChange('en')}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 16px',
                border: 'none',
                background: i18n.language === 'en' ? 'var(--border-color, rgba(0,0,0,0.05))' : 'transparent',
                color: 'var(--text-main, #212529)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: i18n.language === 'en' ? '600' : '500',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--border-color, rgba(0, 0, 0, 0.05))'}
              onMouseLeave={(e) => e.target.style.background = i18n.language === 'en' ? 'var(--border-color, rgba(0,0,0,0.05))' : 'transparent'}
            >
              <span>English</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted, #6c757d)' }}>English</span>
            </button>
          </li>
          <div style={{ height: '1px', background: 'var(--border-color, rgba(0,0,0,0.1))', margin: '4px 0' }} />
          {/* Other languages sorted alphabetically by English name */}
          {languages
            .filter(l => l.code !== 'en')
            .map(lang => (
              <li key={lang.code}>
                <button
                  onClick={() => handleLanguageChange(lang.code)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 16px',
                    border: 'none',
                    background: i18n.language === lang.code ? 'var(--border-color, rgba(0,0,0,0.05))' : 'transparent',
                    color: 'var(--text-main, #212529)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: i18n.language === lang.code ? '600' : '500',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'var(--border-color, rgba(0, 0, 0, 0.05))'}
                  onMouseLeave={(e) => e.target.style.background = i18n.language === lang.code ? 'var(--border-color, rgba(0,0,0,0.05))' : 'transparent'}
                >
                  <span>{lang.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted, #6c757d)' }}>{lang.nativeName}</span>
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default function Navbar() {
  const { t } = useTranslation();

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Group 1: Logo (Left) */}
        <NavLink to="/" className="nav-logo">
          {t('nav.home')}
        </NavLink>

        {/* Group 2: Navigation Links (Center) */}
        <nav className="nav-menu">
          <NavLink to="/about" className="nav-links">{t('nav.about')}</NavLink>
          <NavLink to="/maps" className="nav-links">{t('nav.maps')}</NavLink>
          <NavLink to="/alerts" className="nav-links">{t('nav.alerts')}</NavLink>
          <NavLink to="/living-labs" className="nav-links">{t('nav.livingLabs')}</NavLink>
          <NavLink to="/serious-games" className="nav-links">{t('nav.seriousGames')}</NavLink>
          <NavLink to="/research" className="nav-links">{t('nav.research')}</NavLink>
          <NavLink to="/team" className="nav-links">{t('nav.team')}</NavLink>
          <NavLink to="/internal-access" className="nav-links" style={{ opacity: 0.7, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LockIcon size={14} /> {t('nav.internalAccess')}
          </NavLink>
        </nav>

        {/* Group 3: Action Item (Right) */}
        <div className="nav-action-item" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
