/* eslint-disable no-unused-vars */
// src/pages/About.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '../App.css';

export default function About() {
  const { t } = useTranslation();

  const objectives = [
    { id: 'RO1', text: t('about.objectives.objective1.text') },
    { id: 'RO2', text: t('about.objectives.objective2.text') },
    { id: 'RO3', text: t('about.objectives.objective3.text') },
  ];

  const workStreams = [
    { title: t('about.workStreams.ws1.title'), description: t('about.workStreams.ws1.text') },
    { title: t('about.workStreams.ws2.title'), description: t('about.workStreams.ws2.text') },
    { title: t('about.workStreams.ws3.title'), description: t('about.workStreams.ws3.text') },
    { title: t('about.workStreams.ws4.title'), description: t('about.workStreams.ws4.text') },
    { title: t('about.workStreams.ws5.title'), description: t('about.workStreams.ws5.text') }
  ];

  return (
    <div>
      <motion.section
        className="hero-section-about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="container">
          <h1 className="hero-title-about">{t('about.title')}</h1>
          <p className="hero-subtitle-about">
            {t('about.subtitle')}
          </p>
        </div>
      </motion.section>

      <section className="page-section">
        <div className="container">

          {/* --- Feature Blocks: Challenge & Vision --- */}
          <div className="about-grid">
            <motion.div
              className="about-grid-title"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <h2>{t('about.challenge_vision')}</h2>
            </motion.div>
            <div className="feature-split">
              <motion.div
                className="feature-block"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
              >
                <h4>{t('about.challenge.title')}</h4>
                <p>{t('about.challenge.text')}</p>
              </motion.div>
              <motion.div
                className="feature-block"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h4>{t('about.vision.title')}</h4>
                <p>{t('about.vision.text')}</p>
              </motion.div>
            </div>

            {/* --- Bento Grid: Objectives --- */}
            <motion.div
              className="about-grid-title"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              style={{ marginTop: '3rem' }}
            >
              <h2>{t('about.core_objectives')}</h2>
            </motion.div>
            <div className="bento-grid">
              {objectives.map((obj, index) => (
                <motion.div
                  key={obj.id}
                  className="bento-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="bento-id">{obj.id}</div>
                  <h4>{t('about.objectives.objective' + (index + 1) + '.title', `Objective ${index + 1}`)}</h4>
                  <p>{obj.text}</p>
                </motion.div>
              ))}
            </div>

            {/* --- Stepper Timeline: Approach --- */}
            <motion.div
              className="about-grid-title"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              style={{ marginTop: '3rem' }}
            >
              <h2>{t('about.approach')}</h2>
            </motion.div>
            <div className="stepper-container">
              {workStreams.map((ws, index) => (
                <motion.div
                  key={ws.title}
                  className="stepper-item"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="stepper-line"></div>
                  <div className="stepper-marker">{index + 1}</div>
                  <div className="stepper-content">
                    <h4>{ws.title}</h4>
                    <p>{ws.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}