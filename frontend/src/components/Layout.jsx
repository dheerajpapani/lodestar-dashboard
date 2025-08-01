// src/components/Layout.jsx
import { useLocation } from 'react-router-dom';
import Navbar from '../pages/Navbar'; // Corrected path to components folder
import Footer from './Footer';
import ThemeToggle from './ThemeToggle'; // Re-added the missing ThemeToggle
import ScrollToTopButton from './ScrollToTopButton';

export default function Layout({ children }) {
  const location = useLocation();

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
    </div>
  );
}
