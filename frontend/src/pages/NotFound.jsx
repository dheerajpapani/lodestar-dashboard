/* eslint-disable no-unused-vars */
// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCompass } from 'react-icons/fa';
import '../App.css';

export default function NotFound() {
  return (
    <div className="notfound-wrapper-themed">
      <motion.div
        className="notfound-container-themed"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="radar-container">
          <FaCompass className="radar-icon" />
          <div className="radar-sweep"></div>
        </div>
        <h1 className="notfound-title-themed">404</h1>
        <h2 className="notfound-subtitle-themed">Lost Signal</h2>
        <p className="notfound-text-themed">
          You've navigated to a data point that is off our forecast map. The requested page could not be found. Let's get you back to charted territory.
        </p>
        <Link to="/" className="cta-button">
          Return to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}