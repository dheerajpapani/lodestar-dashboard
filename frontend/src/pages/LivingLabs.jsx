/* eslint-disable no-unused-vars */
// src/pages/LivingLabs.jsx
import { useState, useMemo } from 'react';
import { FaMapSigns, FaGamepad, FaExchangeAlt, FaHandsHelping, FaUserPlus, FaCommentDots, FaCamera } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ComingSoonBox from '../components/ComingSoonBox'; // Import the modal component
import '../App.css';

export default function LivingLabs() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const methods = useMemo(() => [
    { icon: <FaMapSigns />, title: t('livingLabs.methods.mapping.title', 'Participatory Social Mapping'), text: t('livingLabs.methods.mapping.text', "We begin by mapping the social landscape of disaster risk. Through collaborative exercises, we identify 'Who knows what?' and 'Who needs to know what?' to ensure our tools address the right problems for the right people.") },
    { icon: <FaGamepad />, title: t('livingLabs.methods.gaming.title', 'Serious Gaming & Scenarios'), text: t('livingLabs.methods.gaming.text', "Interactive and immersive games built on realistic disaster scenarios are used to elicit tacit knowledge, test response strategies, and encourage creative problem-solving among diverse stakeholders.") },
    { icon: <FaExchangeAlt />, title: t('livingLabs.methods.learning.title', 'Horizontal Learning'), text: t('livingLabs.methods.learning.text', "We foster an environment of peer-to-peer knowledge exchange, connecting citizens, experts, and officials. This breaks down hierarchies and ensures that all forms of knowledge are valued equally.") }
  ], [t]);

  return (
    <>
      <ComingSoonBox isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="page-wrapper">
        <section className="hero-section-about">
          <div className="container">
            <motion.h1
              className="hero-title-about"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {t('livingLabs.title', 'Living Labs & Citizen Science')}
            </motion.h1>
            <motion.p
              className="hero-subtitle-about"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t('livingLabs.subtitle', "Where community knowledge meets scientific innovation. This is the heart of LODESTAR's bottom-up approach to building disaster resilience.")}
            </motion.p>
          </div>
        </section>

        <section className="page-section">
          <div className="container" style={{ paddingBottom: '50px' }}>
            <h2 className="section-title">{t('livingLabs.whatIs.title', 'What is a Living Lab?')}</h2>
            <motion.div
              className="text-block"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <p>{t('livingLabs.whatIs.text', "A Living Lab is an open innovation environment where we co-create solutions in real-life contexts. It's a space where we bring together all stakeholders to ensure our Multi-Hazard Early Warning System (MH-EWS) matches the actual needs, cultures, and creative potentials of the end-users. This approach moves beyond traditional top-down systems to bridge the critical 'know-do' gap.")}</p>
            </motion.div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <h2 className="section-title">{t('livingLabs.methods.title', 'Our Methods for Co-Creation')}</h2>
            <div className="methods-grid">
              {methods.map((method, index) => (
                <motion.div
                  key={method.title}
                  className="method-card"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <div className="method-icon">{method.icon}</div>
                  <h3>{method.title}</h3>
                  <p>{method.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="page-section cta-section">
          <div className="container">
            <h2 className="section-title cta-title">{t('livingLabs.cta.title', 'Become a Citizen Scientist')}</h2>
            <p className="cta-subtitle">{t('livingLabs.cta.subtitle', "You can play a direct role in making your community safer. Here’s how:")}</p>
            <div className="participation-grid">
              <motion.div
                className="participation-card"
                onClick={() => setIsModalOpen(true)}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2, delay: 0 } }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <FaCamera className="participation-icon" />
                <h4>{t('livingLabs.cta.data.title', 'Contribute Real-time Data')}</h4>
                <p>{t('livingLabs.cta.data.text', 'Use our upcoming mobile tools to share vital on-the-ground information like water levels.')}</p>
              </motion.div>
              <motion.div
                className="participation-card"
                onClick={() => setIsModalOpen(true)}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2, delay: 0 } }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <FaUserPlus className="participation-icon" />
                <h4>{t('livingLabs.cta.workshop.title', 'Join a Workshop')}</h4>
                <p>{t('livingLabs.cta.workshop.text', 'Participate in our local Living Labs to share your experiences and test new tools.')}</p>
              </motion.div>
              <motion.div
                className="participation-card"
                onClick={() => setIsModalOpen(true)}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2, delay: 0 } }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <FaCommentDots className="participation-icon" />
                <h4>{t('livingLabs.cta.knowledge.title', 'Share Local Knowledge')}</h4>
                <p>{t('livingLabs.cta.knowledge.text', 'Your knowledge of past events is invaluable for building more accurate models.')}</p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
