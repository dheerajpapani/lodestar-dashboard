// src/components/Footer.jsx
import { FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import '../App.css';
import CreatorEasterEgg from './CreatorEasterEgg';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-content container">
        <div className="footer-logo-group">
          <FaGlobe />
          <h3>{t('footer.project')}</h3>
        </div>
        <p className="footer-description">
          {t('footer.description')}
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
        <p>{t('footer.copyright')}</p>


        <div className="footer-credits">
          <CreatorEasterEgg>
            <span>{t('footer.credits')}</span>
          </CreatorEasterEgg>
        </div>
      </div>
    </footer>
  );
}
