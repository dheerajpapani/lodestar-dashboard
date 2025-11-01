// src/components/Footer.jsx
import { FaGlobe } from 'react-icons/fa';
import '../App.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content container">
        <div className="footer-logo-group">
          <FaGlobe />
          <h3>LODESTAR Project</h3>
        </div>
        <p className="footer-description">
          A collaborative India-Netherlands initiative to build a low-cost, multi-hazard early warning system for communities at risk.
        </p>
        <div className="footer-links">
          <a href="https://www.iittp.ac.in/" target="_blank" rel="noopener noreferrer">IIT Tirupati</a>
          <span>•</span>
          <a href="https://www.iitg.ac.in/" target="_blank" rel="noopener noreferrer">IIT Guwahati</a>
          <span>•</span>
          <a href="https://www.iisc.ac.in/" target="_blank" rel="noopener noreferrer">IISc Bangalore</a>
          <span>•</span>
          <a href="https://www.wur.nl/en/wageningen-university.htm" target="_blank" rel="noopener noreferrer">Wageningen University &amp; Research</a>
          <span>•</span>
          <a href="https://metameta.nl/" target="_blank" rel="noopener noreferrer">MetaMeta</a>
          <span>•</span>
          <a href="https://cstep.in/" target="_blank" rel="noopener noreferrer">CSTEP</a>
        </div>
      </div>
      <div className="footer-bottom-bar">
        <p>© 2025 LODESTAR Project Consortium | Funded by DST (India) & NWO (Netherlands)</p>

        {/* Updated credits text and removed social links */}
        <div className="footer-credits">
          <span>Dashboard by IIT Tirupati</span>
        </div>
      </div>
    </footer>
  );
}
