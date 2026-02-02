/* eslint-disable no-unused-vars */
// src/pages/Research.jsx
import { useState } from 'react';
import { FaBook, FaWrench, FaDatabase, FaGithub, FaGlobe } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ComingSoonBox from '../components/ComingSoonBox';
import '../App.css';

const projectDeliverables = [
  { icon: <FaWrench />, title: 'Pan-European Decision-Support Dashboard (A4EU)', summary: 'A key dashboard from the ANYWHERE project developed by Wageningen University, serving as a model for LODESTAR\'s EWS.', source: 'Wageningen University' },
  { icon: <FaWrench />, title: 'Serious Games Catalogue & Facilitation Manual', summary: 'A portfolio of physical and digital serious games with a manual for developing and facilitating them in stakeholder workshops.', source: 'MetaMeta Research' },
  { icon: <FaWrench />, title: 'Calibrated Hydrological Model (STORM V1)', summary: 'A calibrated urban flood model for Bangalore, previously used for crowdsourcing studies and foundational to this project\'s modelling work.', source: 'Indian Institute of Sciences' }
];
const keyPublications = [
  { icon: <FaBook />, title: 'Flood disaster subcultures in The Netherlands', summary: 'Examines the social and cultural responses to flood risks in Dutch communities, providing crucial context for the project\'s socio-technical approach.', authors: 'Engel, K., Frerks, G., Velotti, L., Warner, J., & Weijs, B.' },
  { icon: <FaBook />, title: 'Science-policy interface on water scarcity in India', summary: 'Investigates the communication and knowledge gaps between scientific research and policy-making regarding water scarcity in India.', authors: 'Suparana Katyaini, Anamika Barua, and Rosa Duarte' },
  { icon: <FaBook />, title: 'Moving from drought hazard to drought impact forecasts', summary: 'A foundational paper on advancing drought EWS from simply predicting hazards to forecasting their tangible, real-world impacts on communities.', authors: 'Sutanto, S. J., Van der Weert, M., Wanders, N., et al.' }
];

export default function Research() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              Research & Knowledge Hub
            </motion.h1>
            <motion.p
              className="hero-subtitle-about"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Access the project's deliverables, key publications, open data repositories, and foundational documents.
            </motion.p>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <h2 className="section-title">Project Deliverables & Tools</h2>
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
                    <span className="research-card-source">Source: {item.source}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <h2 className="section-title">Key Publications from the Consortium</h2>
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
                    <span className="research-card-source">Authors: {item.authors}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <h2 className="section-title">Data, Models & Open Science</h2>
            <div className="text-block">
              <p>LODESTAR is committed to the FAIR (Findable, Accessible, Interoperable, Reusable) guiding principles for scientific data management. We aim to make knowledge creation, transfer, and exchange transparent and interactive.</p>
            </div>
            <div className="data-grid">
              <div className="data-card" onClick={() => setIsModalOpen(true)}>
                <FaDatabase />
                <h4>4TU.ResearchData</h4>
                <p>Processed data used for publications will be stored and made available via the 4TU research data centre.</p>
              </div>
              <div className="data-card" onClick={() => setIsModalOpen(true)}>
                <FaGithub />
                <h4>GitHub Repository</h4>
                <p>Algorithms, scripts, and software developed during the project will be shared through platforms like GitHub.</p>
              </div>
              <a href="https://www.undrr.org/implementing-sendai-framework" target="_blank" rel="noopener noreferrer" className="data-card">
                <FaGlobe />
                <h4>Sendai Framework</h4>
                <p>The project's goals align with this key framework for Disaster Risk Reduction.</p>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
