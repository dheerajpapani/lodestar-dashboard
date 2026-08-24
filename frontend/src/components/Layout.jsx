// src/components/Layout.jsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../pages/Navbar'; // Corrected path to components folder
import Footer from './Footer';
import ScrollToTopButton from './ScrollToTopButton';
import FeedbackModal from './FeedbackModal';

export default function Layout({ children }) {
  const location = useLocation();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Custom event listener so any component/page can trigger the modal
  useEffect(() => {
    const handleOpenFeedback = () => setIsFeedbackOpen(true);
    window.addEventListener('open-feedback-modal', handleOpenFeedback);
    return () => window.removeEventListener('open-feedback-modal', handleOpenFeedback);
  }, []);

  // This logic correctly hides the footer ONLY on the maps page
  const showFooter = location.pathname !== '/maps';

  return (
    <div className="app-container"> 
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      
      {/* Conditionally render the footer */}
      {showFooter && <Footer />}

      {/* Utility buttons are placed here to appear on top of all content */}
      <ScrollToTopButton />

      {/* Global Feedback Modal */}
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
}
