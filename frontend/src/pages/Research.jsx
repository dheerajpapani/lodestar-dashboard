/* eslint-disable no-unused-vars */
// src/pages/Research.jsx
import { useState, useMemo } from 'react';
import { FaBook, FaWrench, FaDatabase, FaGithub, FaGlobe } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ComingSoonBox from '../components/ComingSoonBox';
import '../App.css';

export default function Research() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projectDeliverables = useMemo(() => [
    { icon: <FaWrench />, title: t('research.deliverables.a4eu.title', 'Pan-European Decision-Support Dashboard (A4EU)'), summary: t('research.deliverables.a4eu.summary', 'A key dashboard from the ANYWHERE project developed by Wageningen University, serving as a model for LODESTAR\'s EWS.'), source: t('research.deliverables.a4eu.source', 'Wageningen University') },
    { icon: <FaWrench />, title: t('research.deliverables.games.title', 'Serious Games Catalogue & Facilitation Manual'), summary: t('research.deliverables.games.summary', 'A portfolio of physical and digital serious games with a manual for developing and facilitating them in stakeholder workshops.'), source: t('research.deliverables.games.source', 'MetaMeta Research') },
    { icon: <FaWrench />, title: t('research.deliverables.storm.title', 'Calibrated Hydrological Model (STORM V1)'), summary: t('research.deliverables.storm.summary', 'A calibrated urban flood model for Bangalore, previously used for crowdsourcing studies and foundational to this project\'s modelling work.'), source: t('research.deliverables.storm.source', 'Indian Institute of Sciences') }
  ], [t]);

  const keyPublications = useMemo(() => [
    { icon: <FaBook />, title: t('research.publications.subcultures.title', 'Flood disaster subcultures in The Netherlands'), summary: t('research.publications.subcultures.summary', 'Examines the social and cultural responses to flood risks in Dutch communities, providing crucial context for the project\'s socio-technical approach.'), authors: 'Engel, K., Frerks, G., Velotti, L., Warner, J., & Weijs, B.' },
    { icon: <FaBook />, title: t('research.publications.interface.title', 'Science-policy interface on water scarcity in India'), summary: t('research.publications.interface.summary', 'Investigates the communication and knowledge gaps between scientific research and policy-making regarding water scarcity in India.'), authors: 'Suparana Katyaini, Anamika Barua, and Rosa Duarte' },
    { icon: <FaBook />, title: t('research.publications.forecasts.title', 'Moving from drought hazard to drought impact forecasts'), summary: t('research.publications.forecasts.summary', 'A foundational paper on advancing drought EWS from simply predicting hazards to forecasting their tangible, real-world impacts on communities.'), authors: 'Sutanto, S. J., Van der Weert, M., Wanders, N., et al.' }
  ], [t]);

  return (
    <>
      <ComingSoonBox isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div>
        <section className="hero-section-about">
          <div className="container">
            <motion.h1
              className="hero-title-about"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {t('research.title', 'Research & Knowledge Hub')}
            </motion.h1>
            <motion.p
              className="hero-subtitle-about"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t('research.subtitle', "Access the project's deliverables, key publications, open data repositories, and foundational documents.")}
            </motion.p>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <h2 className="section-title">{t('research.deliverables.sectionTitle', 'Project Deliverables & Tools')}</h2>
            <motion.div
              className="research-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ staggerChildren: 0.15 }}
            >
              {projectDeliverables.map(item => (
                <motion.div
                  key={item.title}
                  className="research-card"
                  variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
                >
                  <div className="research-card-icon">{item.icon}</div>
                  <div className="research-card-content">
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <span className="research-card-source">{t('research.sourceLabel', 'Source:')} {item.source}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <h2 className="section-title">{t('research.publications.sectionTitle', 'Key Publications from the Consortium')}</h2>
            <motion.div
              className="research-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ staggerChildren: 0.15 }}
            >
              {keyPublications.map(item => (
                <motion.div
                  key={item.title}
                  className="research-card"
                  variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
                >
                  <div className="research-card-icon">{item.icon}</div>
                  <div className="research-card-content">
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <span className="research-card-source">{t('research.authorsLabel', 'Authors:')} {item.authors}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <h2 className="section-title">{t('research.openScience.title', 'Data, Models & Open Science')}</h2>
            <div className="text-block">
              <p>{t('research.openScience.text', 'LODESTAR is committed to the FAIR (Findable, Accessible, Interoperable, Reusable) guiding principles for scientific data management. We aim to make knowledge creation, transfer, and exchange transparent and interactive.')}</p>
            </div>
            <div className="data-grid">
              <div className="data-card" onClick={() => setIsModalOpen(true)}>
                <FaDatabase />
                <h4>4TU.ResearchData</h4>
                <p>{t('research.openScience.cards.fourTu', 'Processed data used for publications will be stored and made available via the 4TU research data centre.')}</p>
              </div>
              <div className="data-card" onClick={() => setIsModalOpen(true)}>
                <FaGithub />
                <h4>GitHub Repository</h4>
                <p>{t('research.openScience.cards.github', 'Algorithms, scripts, and software developed during the project will be shared through platforms like GitHub.')}</p>
              </div>
              <a href="https://www.undrr.org/implementing-sendai-framework" target="_blank" rel="noopener noreferrer" className="data-card">
                <FaGlobe />
                <h4>{t('research.openScience.cards.sendai.title', 'Sendai Framework')}</h4>
                <p>{t('research.openScience.cards.sendai.text', "The project's goals align with this key framework for Disaster Risk Reduction.")}</p>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
