// src/pages/Navbar.jsx
import { NavLink } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle.jsx';
import '../App.css';

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
        </nav>

        {/* Group 3: Action Item (Right) */}
        <div className="nav-action-item">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
