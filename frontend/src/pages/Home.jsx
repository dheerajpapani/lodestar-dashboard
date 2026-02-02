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
      {/* SECTION 1: HERO (Updated 3D) */}
      <section className="hero-section">
        {/* Floating Background Effects */}
        <div className="hero-bg-circle" style={{ width: '300px', height: '300px', top: '-50px', left: '-50px', opacity: 0.6 }}></div>
        <div className="hero-bg-circle" style={{ width: '200px', height: '200px', bottom: '10%', right: '5%', opacity: 0.4, animationDelay: '1s' }}></div>
        <div className="hero-bg-circle" style={{ width: '150px', height: '150px', top: '20%', right: '20%', opacity: 0.3, animationDelay: '2s' }}></div>

        <motion.div
          className="container-wide hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="hero-title">LODESTAR</h1>
          <p className="hero-subtitle">Resilience • Intelligence • Community</p>
          <p className="hero-description">
            A next-generation multi-hazard early warning system bridging the gap between advanced predictive analytics and community-led action.
          </p>
        </motion.div>
      </section>

      {/* SECTION 2: CORE CONCEPTS */}
      <section className="concepts-section">
        <div className="container-wide">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Core Architecture
          </motion.h2>
          <div className="concepts-grid">
            {keyConcepts.map((concept, index) => (
              <motion.div
                key={concept.title}
                className="concept-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="concept-icon">{concept.icon}</div>
                <h3 className="concept-title">{concept.title}</h3>
                <p className="concept-text">{concept.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: IMMERSIVE MAP CTA */}
      <motion.section
        className="cta-map-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="cta-map-overlay"></div>
        <div className="container-wide cta-map-content">
          <h2>Live Geo-Dashboard</h2>
          <p>Access real-time active alerts, flood forecasts, and community reports in our 3D interactive map interface.</p>
          <Link to="/maps" className="cta-map-button">
            Launch Dashboard <FaArrowRight />
          </Link>
        </div>
      </motion.section>

      {/* SECTION 4: STUDY SITES */}
      <section className="sites-section">
        <div className="container-wide">
          <h2 className="section-title">Deployment Sites</h2>
          <div className="sites-grid">
            {studySites.map((site, index) => (
              <motion.div
                key={site.name}
                className="site-card-home"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`site-flag ${site.country.toLowerCase()}`}></div>
                <h3 className="site-name">
                  <img
                    src={`https://flagcdn.com/w40/${site.country === 'India' ? 'in' : 'nl'}.png`}
                    alt={site.country}
                    className="site-flag-icon"
                  />
                  {site.name}
                </h3>
                <p className="site-hazard"><strong>Focus:</strong> {site.hazard}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}