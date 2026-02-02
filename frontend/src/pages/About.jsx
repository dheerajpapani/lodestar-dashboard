/* eslint-disable no-unused-vars */
// src/pages/About.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../App.css';

const objectives = [
  { id: 'RO1', text: 'To develop socio-technical disaster and emergency (early warning) services (MH-EWS dashboards) to address the challenges of extreme compound disaster events in India and the Netherlands.' },
  { id: 'RO2', text: 'To improve flood and drought modelling and user interface by focusing on innovative technologies, to arrive at an integrated MH-EWS for floods and/or droughts.' },
  { id: 'RO3', text: 'To develop socio-cultural and management innovations via living labs, necessary for implementing new technologies and accelerating uptake, while ensuring long-term sustainability.' },
];
const workStreams = [
  { title: "WS 1: Disaster Context & Knowledge Gaps", description: "Sets the disaster context by taking stock of existing systems and identifying socio-technical knowledge gaps in flood and drought management to build a foundation for the project." },
  { title: "WS 2: Real-time Data Assimilation", description: "Conducts real-time hydrometeorological data assimilation using computer vision-based algorithms and extended weather forecasts, leveraging low-cost sensors and citizen science." },
  { title: "WS 3: Citizen Science & Living Labs", description: "Creates synergy between citizens, academics, and professionals using 'living labs' and 'serious games' to facilitate knowledge exchange, co-create solutions, and ensure the EWS meets user needs." },
  { title: "WS 4: Integrated Dashboard & Forecasting", description: "Develops a multi-hazard forecast framework using an ensemble of models (AI/ML, process-based) to co-create a user-centric, integrated MH-EWS dashboard for mobile and web." },
  { title: "WS 5: Capacity Building & Internationalization", description: "Builds the disaster management capacity of all partners and external stakeholders in India and the Netherlands through training, workshops, summer academies, and international outreach." }
];

export default function About() {
  return (
    <div>
      <motion.section
        className="hero-section-about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="container">
          <h1 className="hero-title-about">About The LODESTAR Project</h1>
          <p className="hero-subtitle-about">
            Understanding the vision, objectives, and methodology behind our collaborative effort to build disaster resilience.
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
              <h2>The Challenge & Our Vision</h2>
            </motion.div>
            <div className="feature-split">
              <motion.div
                className="feature-block"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
              >
                <h4>The Challenge</h4>
                <p>Existing Early Warning Systems often lack sufficient lead times and fail to integrate crucial community knowledge. This creates a "know-do gap," where warnings don't translate into effective local actions.</p>
              </motion.div>
              <motion.div
                className="feature-block"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h4>Our Vision</h4>
                <p>LODESTAR's vision is to co-create a low-cost, multi-hazard EWS using a "living labs" approach. This makes the system more comprehensive, participatory, and responsive, improving disaster preparedness for all.</p>
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
              <h2>Our Core Objectives</h2>
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
                  <h4>Objective {index + 1}</h4>
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
              <h2>Our Approach</h2>
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