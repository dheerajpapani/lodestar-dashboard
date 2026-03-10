// src/pages/Navbar.jsx
import { NavLink } from 'react-router-dom';
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

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Group 1: Logo (Left) */}
        <NavLink to="/" className="nav-logo">
          LODESTAR
        </NavLink>

        {/* Group 2: Navigation Links (Center) */}
        <nav className="nav-menu">
          <NavLink to="/about" className="nav-links">About</NavLink>
          <NavLink to="/maps" className="nav-links">Map</NavLink>
          <NavLink to="/alerts" className="nav-links">Alerts</NavLink>
          <NavLink to="/living-labs" className="nav-links">Living Labs</NavLink>
          <NavLink to="/serious-games" className="nav-links">Serious Games</NavLink>
          <NavLink to="/research" className="nav-links">Research</NavLink>
          <NavLink to="/team" className="nav-links">Team</NavLink>
          <NavLink to="/internal-access" className="nav-links" style={{ opacity: 0.7, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LockIcon size={14} /> Consortium Drive
          </NavLink>
        </nav>

        {/* Group 3: Action Item (Right) */}
        <div className="nav-action-item">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
