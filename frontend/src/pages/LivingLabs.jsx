/* eslint-disable no-unused-vars */
// src/pages/LivingLabs.jsx
import { useState } from 'react'; // Import useState
import { FaMapSigns, FaGamepad, FaExchangeAlt, FaHandsHelping, FaUserPlus, FaCommentDots, FaCamera } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ComingSoonBox from '../components/ComingSoonBox'; // Import the modal component
import '../App.css';

const methods = [
  { icon: <FaMapSigns />, title: 'Participatory Social Mapping', text: "We begin by mapping the social landscape of disaster risk. Through collaborative exercises, we identify 'Who knows what?' and 'Who needs to know what?' to ensure our tools address the right problems for the right people." },
  { icon: <FaGamepad />, title: 'Serious Gaming & Scenarios', text: "Interactive and immersive games built on realistic disaster scenarios are used to elicit tacit knowledge, test response strategies, and encourage creative problem-solving among diverse stakeholders." },
  { icon: <FaExchangeAlt />, title: 'Horizontal Learning', text: "We foster an environment of peer-to-peer knowledge exchange, connecting citizens, experts, and officials. This breaks down hierarchies and ensures that all forms of knowledge are valued equally." }
];

export default function LivingLabs() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              Living Labs & Citizen Science
            </motion.h1>
            <motion.p 
              className="hero-subtitle-about"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Where community knowledge meets scientific innovation. This is the heart of LODESTAR's bottom-up approach to building disaster resilience.
            </motion.p>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <h2 className="section-title">What is a Living Lab?</h2>
            <motion.div 
              className="text-block"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <p>A Living Lab is an open innovation environment where we co-create solutions in real-life contexts. It's a space where we bring together all stakeholders to ensure our Multi-Hazard Early Warning System (MH-EWS) matches the actual needs, cultures, and creative potentials of the end-users. This approach moves beyond traditional top-down systems to bridge the critical 'know-do' gap.</p>
            </motion.div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <h2 className="section-title">Our Methods for Co-Creation</h2>
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
            <h2 className="section-title cta-title">Become a Citizen Scientist</h2>
            <p className="cta-subtitle">You can play a direct role in making your community safer. Here’s how:</p>
            <div className="participation-grid">
                <motion.div 
                  className="participation-card"
                  onClick={() => setIsModalOpen(true)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <FaCamera className="participation-icon" />
                    <h4>Contribute Real-time Data</h4>
                    <p>Use our upcoming mobile tools to share vital on-the-ground information like water levels.</p>
                </motion.div>
                <motion.div 
                  className="participation-card"
                  onClick={() => setIsModalOpen(true)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <FaUserPlus className="participation-icon" />
                    <h4>Join a Workshop</h4>
                    <p>Participate in our local Living Labs to share your experiences and test new tools.</p>
                </motion.div>
                <motion.div 
                  className="participation-card"
                  onClick={() => setIsModalOpen(true)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <FaCommentDots className="participation-icon" />
                    <h4>Share Local Knowledge</h4>
                    <p>Your knowledge of past events is invaluable for building more accurate models.</p>
                </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
