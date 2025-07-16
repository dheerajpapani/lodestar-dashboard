// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import '../App.css';

const sites = [
  { name: 'Bengaluru', status: '—' },
  { name: 'Guwahati', status: '—' },
  { name: 'Anantapur', status: '—' },
  { name: 'Dordrecht', status: '—' },
];

export default function Home() {
  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <header className="home-hero">
        <h1 className="hero-title">🌐 LODESTAR Dashboard</h1>
        <p className="hero-subtitle">
          A multi-hazard early warning system for floods & droughts.
        </p>
      </header>

      {/* Site Overview Cards */}
      <section className="site-cards">
        {sites.map(site => (
          <div key={site.name} className="site-card">
            <h2 className="site-name">{site.name}</h2>
            <div className="site-status">
              <strong>Status:</strong> {site.status}
            </div>
          </div>
        ))}
      </section>

      {/* Quick Navigation */}
      <section className="quick-links">
        <Link to="/maps"      className="link-btn">🗺️ View Map</Link>
        <Link to="/forecasts" className="link-btn">📈 Forecasts</Link>
        <Link to="/alerts"    className="link-btn">🚨 Alerts</Link>
        <Link to="/community" className="link-btn">👥 Community</Link>
        <Link to="/games"     className="link-btn">🎮 Games</Link>
        <Link to="/research"  className="link-btn">📚 Research</Link>
      </section>
    </div>
  );
}

