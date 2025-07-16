/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import { FaFileAlt, FaGlobe, FaTools, FaBook } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../App.css';

const researchSections = {
  Reports: [
    {
      title: 'Global Flood Risk Report 2023',
      summary: 'Analyzes climate-induced flood trends and risk zones across South Asia.',
      icon: <FaFileAlt />,
      updated: 'Jun 2024',
      link: 'https://reliefweb.int/report/world/global-flood-risk-2023',
    },
    {
      title: 'IPCC Climate Change 2022',
      summary: 'Scientific basis of climate risks and their effects on water cycles.',
      icon: <FaBook />,
      updated: 'Mar 2022',
      link: 'https://www.ipcc.ch/report/ar6/wg2/',
    },
  ],
  Tools: [
    {
      title: 'Copernicus Climate Data Store',
      summary: 'Satellite-based flood, drought, and climate datasets globally.',
      icon: <FaGlobe />,
      updated: 'Apr 2023',
      link: 'https://cds.climate.copernicus.eu/',
    },
    {
      title: 'NASA GLOBE Observer',
      summary: 'Citizen science tools for flood mapping and climate tracking.',
      icon: <FaTools />,
      updated: 'Feb 2024',
      link: 'https://observer.globe.gov/',
    },
  ],
};

export default function Research() {
  return (
    <div className="section-wrapper">
      {/* Hero with animation */}
      <motion.header
        className="section-hero"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="section-title">📚 Research & Learning</h1>
        <p className="section-subtitle">
          Curated scientific tools, reports, and knowledge for disaster resilience.
        </p>
      </motion.header>

      {Object.entries(researchSections).map(([sectionTitle, items], idx) => (
        <motion.section
          key={sectionTitle}
          className="research-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + idx * 0.2, duration: 0.4 }}
        >
          <h2 className="research-heading">{sectionTitle}</h2>
          <div className="research-list">
            {items.map(({ title, summary, icon, link, updated }) => (
              <a
                key={title}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="research-card"
              >
                <div className="research-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{summary}</p>
                <span className="updated-label">🕒 Updated: {updated}</span>
              </a>
            ))}
          </div>
        </motion.section>
      ))}

      <Link to="/" className="section-back-btn">🏠 Back to Home</Link>
    </div>
  );
}
