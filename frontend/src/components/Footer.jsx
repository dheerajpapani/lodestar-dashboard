// src/components/Footer.jsx
import { FaGlobe, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
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
          <a href="https://www.wur.nl/en/wageningen-university.htm" target="_blank" rel="noopener noreferrer">Wageningen University & Research</a>
          <span>•</span>
          <a href="https://www.iitg.ac.in/" target="_blank" rel="noopener noreferrer">IIT Guwahati</a>
        </div>
      </div>
      <div className="footer-bottom-bar">
        <p>© 2025 LODESTAR Project Consortium | Funded by DST (India) & NWO (Netherlands)</p>
        
        {/* ADDED: Your credits section */}
        <div className="footer-credits">
          <span>Dashboard by Dheeraj Papani</span>
          <div className="footer-social-links">
            <a href="mailto:dheerajpapani@gmail.com" title="Email" target="_blank" rel="noopener noreferrer"><FaEnvelope /></a>
            <a href="https://www.linkedin.com/in/dheeraj-papani-507693274/" title="LinkedIn" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            <a href="https://github.com/dheerajpapani" title="GitHub" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}