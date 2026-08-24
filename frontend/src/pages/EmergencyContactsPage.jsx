// src/pages/EmergencyContactsPage.jsx
import { useTranslation } from 'react-i18next';
import EmergencyContacts from '../components/EmergencyContacts';
import '../App.css';

export default function EmergencyContactsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <section className="hero-section-about">
        <div className="container">
          <h1 className="hero-title-about">
            {t('emergencyPage.title', 'Disaster Emergency Contacts')}
          </h1>
          <p className="hero-subtitle-about">
            {t('emergencyPage.subtitle', 'Official 24/7 helplines, control rooms, and rapid response units across LODESTAR study sites.')}
          </p>
        </div>
      </section>

      <section className="page-section" style={{ paddingTop: '1.5rem' }}>
        <div className="container">
          <EmergencyContacts />
        </div>
      </section>
    </div>
  );
}
