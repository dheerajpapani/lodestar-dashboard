/* eslint-disable no-unused-vars */
// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaUsers, FaBrain, FaBroadcastTower, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../App.css';

const studySites = [
  { name: 'Bengaluru, India', hazard: 'Urban Floods', country: 'India' },
  { name: 'Guwahati, India', hazard: 'Compound Pluvial & Fluvial Floods', country: 'India' },
  { name: 'Anantapur, India', hazard: 'Compound Flood & Drought Events', country: 'India' },
  { name: 'Dordrecht, NL', hazard: 'Urban Floods & Evacuation Planning', country: 'Netherlands' },
  { name: 'Tilburg & Breda, NL', hazard: 'Droughts & Urban Development', country: 'Netherlands' },
];
const keyConcepts = [
  { icon: <FaBroadcastTower />, title: 'Early Warning System', text: 'Developing a multi-hazard EWS for both single and compound events.' },
  { icon: <FaUsers />, title: 'Living Labs', text: 'Co-creating solutions through participatory workshops with citizens and experts.' },
  { icon: <FaBrain />, title: 'Citizen Science', text: 'Integrating local knowledge and real-time, user-submitted data into scientific models.' },
  { icon: <FaShieldAlt />, title: 'Disaster Management', text: 'Enhancing the resilience of at-risk communities against extreme climate events.' },
];

export default function Home() {
  return (
    <div>
      {/* SECTION 1: HERO */}
      <section className="hero-section">
        <div className="hero-background-shape"></div>
        <div className="container hero-content">
          <h1 className="hero-title">LODESTAR</h1>
          <p className="hero-subtitle">Low-cost Disaster & Emergency Services for Communities At Risk</p>
          <p className="hero-description">A collaborative India-Netherlands project to build a reliable, low-cost, multi-hazard early warning system for floods and droughts, integrating advanced technology with community-led citizen science.</p>
        </div>
      </section>

      {/* SECTION 2: CORE CONCEPTS */}
      <section className="concepts-section">
        <div className="container">
          <h2 className="section-title">Core Concepts</h2>
          <div className="concepts-grid">
            {keyConcepts.map(concept => (
              <div key={concept.title} className="concept-card">
                <div className="concept-icon">{concept.icon}</div>
                <h3 className="concept-title">{concept.title}</h3>
                <p className="concept-text">{concept.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: NEW CREATIVE CTA */}
      <motion.section 
        className="cta-map-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        <div className="cta-map-overlay"></div>
        <div className="container cta-map-content">
            <h2>Explore the Geo-Dashboard</h2>
            <p>View real-time data, forecasts, and active alerts on our interactive map.</p>
            <Link to="/maps" className="cta-map-button">
              Launch Interactive Map <FaArrowRight />
            </Link>
        </div>
      </motion.section>

      {/* SECTION 4: STUDY SITES */}
      <section className="sites-section">
        <div className="container">
          <h2 className="section-title">Our Study Sites</h2>
          <div className="sites-grid">
            {studySites.map(site => (
              <div key={site.name} className="site-card-home">
                <div className={`site-flag ${site.country.toLowerCase()}`}></div>
                <h3 className="site-name">{site.name}</h3>
                <p className="site-hazard"><strong>Focus:</strong> {site.hazard}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}