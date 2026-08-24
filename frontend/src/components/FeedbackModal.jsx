// src/components/FeedbackModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes, FaExternalLinkAlt, FaCommentDots, FaSpinner } from 'react-icons/fa';

const FORM_EMBED_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfw1_6i-DjnSZMVVjxOtX44qTzQowSHf28bSihPYxslK-IPBA/viewform?embedded=true";
const FORM_DIRECT_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfw1_6i-DjnSZMVVjxOtX44qTzQowSHf28bSihPYxslK-IPBA/viewform";

export default function FeedbackModal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(true);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsLoading(true);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="feedback-modal-overlay" onClick={onClose} aria-modal="true" role="dialog">
      <div className="feedback-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="feedback-modal-header">
          <div className="feedback-modal-title-group">
            <div className="feedback-modal-icon-badge">
              <FaCommentDots size={18} />
            </div>
            <div>
              <h3 className="feedback-modal-title">Share Your Feedback</h3>
              <p className="feedback-modal-subtitle">Help us improve the Lodestar Dashboard</p>
            </div>
          </div>

          <div className="feedback-modal-actions">
            <a
              href={FORM_DIRECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="feedback-external-btn"
              title="Open in new tab"
            >
              <span>Open in new tab</span>
              <FaExternalLinkAlt size={12} />
            </a>
            <button
              className="feedback-modal-close"
              onClick={onClose}
              title="Close feedback window"
              aria-label="Close"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body with Iframe */}
        <div className="feedback-modal-body">
          {isLoading && (
            <div className="feedback-loading-state">
              <FaSpinner className="feedback-spinner" size={28} />
              <p>Loading Feedback Form...</p>
            </div>
          )}
          <iframe
            src={FORM_EMBED_URL}
            title="Lodestar Feedback Form"
            className="feedback-iframe"
            onLoad={() => setIsLoading(false)}
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
          >
            Loading…
          </iframe>
        </div>
      </div>
    </div>
  );
}
