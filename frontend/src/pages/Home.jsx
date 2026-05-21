/* eslint-disable no-unused-vars */
// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaUsers, FaBrain, FaBroadcastTower, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '../App.css';

export default function Home() {
  const { t } = useTranslation();

  const studySites = [
    { name: t('home.sites.siteList.bengaluru'), hazard: t('home.sites.hazardList.bengaluru'), country: t('home.sites.country.india'), countryKey: 'india' },
    { name: t('home.sites.siteList.guwahati'), hazard: t('home.sites.hazardList.guwahati'), country: t('home.sites.country.india'), countryKey: 'india' },
    { name: t('home.sites.siteList.anantapur'), hazard: t('home.sites.hazardList.anantapur'), country: t('home.sites.country.india'), countryKey: 'india' },
    { name: t('home.sites.siteList.dordrecht'), hazard: t('home.sites.hazardList.dordrecht'), country: t('home.sites.country.netherlands'), countryKey: 'netherlands' },
    { name: t('home.sites.siteList.geertruidenberg'), hazard: t('home.sites.hazardList.geertruidenberg'), country: t('home.sites.country.netherlands'), countryKey: 'netherlands' },
  ];

  const keyConcepts = [
    { icon: <FaBroadcastTower />, title: t('home.concepts.ews.title'), text: t('home.concepts.ews.text') },
    { icon: <FaUsers />, title: t('home.concepts.labs.title'), text: t('home.concepts.labs.text') },
    { icon: <FaBrain />, title: t('home.concepts.science.title'), text: t('home.concepts.science.text') },
    { icon: <FaShieldAlt />, title: t('home.concepts.disaster.title'), text: t('home.concepts.disaster.text') },
  ];

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
          <h1 className="hero-title">{t('nav.home')}</h1>
          <p className="hero-subtitle">{t('home.hero.subtitle')}</p>
          <p className="hero-description">
            {t('home.hero.description')}
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
            {t('home.concepts.title')}
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
          <h2>{t('home.cta.title')}</h2>
          <p>{t('home.cta.description')}</p>
          <Link to="/maps" className="cta-map-button">
            {t('home.cta.button')} <FaArrowRight />
          </Link>
        </div>
      </motion.section>

      {/* SECTION 4: STUDY SITES */}
      <section className="sites-section">
        <div className="container-wide">
          <h2 className="section-title">{t('home.sites.title')}</h2>
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
                <div className={`site-flag ${site.countryKey}`}></div>
                <h3 className="site-name">
                  <img
                    src={`https://flagcdn.com/w40/${site.countryKey === 'india' ? 'in' : 'nl'}.png`}
                    alt={site.country}
                    className="site-flag-icon"
                  />
                  {site.name}
                </h3>
                <p className="site-hazard"><strong>{t('home.sites.focus')}:</strong> {site.hazard}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}