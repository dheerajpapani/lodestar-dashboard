// src/components/ComingSoonBox.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { FaTools, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import '../App.css';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { y: "-50px", opacity: 0 },
  visible: { y: "0", opacity: 1, transition: { delay: 0.2, type: 'spring', stiffness: 120 } },
  exit: { y: "50px", opacity: 0 }
};

export default function ComingSoonBox({ isOpen, onClose }) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="coming-soon-box"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
            <FaTools className="coming-soon-icon" />
            <h2 className="coming-soon-title">{t('comingSoon.title', 'Feature in Development')}</h2>
            <p className="coming-soon-text">
              {t('comingSoon.text', 'This data repository is a planned deliverable of the LODESTAR project. Our teams are currently developing the necessary infrastructure. Please check back for future updates!')}
            </p>
            <button onClick={onClose} className="cta-button">
              {t('comingSoon.button', 'Continue Exploring')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}