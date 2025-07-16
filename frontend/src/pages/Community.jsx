// src/pages/Community.jsx
import { Link } from 'react-router-dom';
import '../App.css';

export default function Community() {
  return (
    <div className="section-wrapper">
      {/* Hero Section */}
      <div className="section-hero">
        <h1 className="section-title">Community Engagement</h1>
        <p className="section-subtitle">
          A shared space for collaboration, awareness, and resilience building during extreme weather events.
        </p>
      </div>

      {/* Intro Info */}
      <div className="section-content">
        <div className="section-box">
          <p>
            We're working on features that will enable community members to share updates, resources, and local responses
            during floods, droughts, and other climate hazards.
          </p>
          <p>
            This space will host interactive tools, live discussions, and region-specific preparedness guides.
          </p>
        </div>
      </div>

      {/* Interactive Cards */}
      <div className="community-section">
        <div className="community-card">
          <h4>📢 Share Your Experience</h4>
          <p>Tell us how climate events have affected your region.</p>
          <button className="community-btn">Submit Story</button>
        </div>

        <div className="community-card">
          <h4>🖼️ Photo Gallery</h4>
          <p>Browse and contribute photos from your local weather events.</p>
          <button className="community-btn">View Gallery</button>
        </div>

        <div className="community-card">
          <h4>📝 Give Feedback</h4>
          <p>Help us improve LODESTAR by sharing your ideas.</p>
          <button className="community-btn">Send Feedback</button>
        </div>
      </div>

      {/* Back to Home */}
      <Link to="/" className="section-back-btn">← Back to Home</Link>
    </div>
  );
}
