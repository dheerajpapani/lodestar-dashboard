// src/components/FeedbackButton.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaCommentDots } from 'react-icons/fa';
import '../App.css';

export default function FeedbackButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="feedback-floating-btn"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title="Give Feedback"
      aria-label="Give Feedback"
    >
      <FaCommentDots className="feedback-btn-icon" size={16} />
      <span className="feedback-btn-text">Feedback</span>
    </motion.button>
  );
}
