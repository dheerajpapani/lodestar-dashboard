/* eslint-disable no-unused-vars */
// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCompass } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import '../App.css';

export default function NotFound() {
  const { t } = useTranslation();

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
        <h1 className="notfound-title-themed">{t('notfound.title')}</h1>
        <h2 className="notfound-subtitle-themed">{t('notfound.subtitle')}</h2>
        <p className="notfound-text-themed">
          {t('notfound.text')}
        </p>
        <Link to="/" className="cta-button">
          {t('notfound.button')}
        </Link>
      </motion.div>
    </div>
  );
}