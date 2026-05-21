/* eslint-disable no-unused-vars */
// src/pages/Alerts.jsx
import { useState, useMemo } from 'react';
import { FaExclamationCircle, FaFilter, FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '../App.css';

const severityOrder = { 'Minor': 1, 'Moderate': 2, 'Severe': 3, 'Extreme': 4 };

// Animation variants
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Alerts() {
  const { t } = useTranslation();
  const [filterSite, setFilterSite] = useState('All');
  const [filterHazard, setFilterHazard] = useState('All');

  const allAlerts = useMemo(() => [
    { id: 1, site: 'Guwahati', hazard: 'Flood', severity: 'Severe', issued: '2025-07-31 01:00 IST', summary: t('alerts.list.g1'), actions: t('alerts.list.g1_a') },
    { id: 2, site: 'Anantapur', hazard: 'Drought', severity: 'Moderate', issued: '2025-07-30 10:00 IST', summary: t('alerts.list.a1'), actions: t('alerts.list.a1_a') },
    { id: 3, site: 'Bengaluru', hazard: 'Flood', severity: 'Moderate', issued: '2025-07-31 00:30 IST', summary: t('alerts.list.b1'), actions: t('alerts.list.b1_a') },
    { id: 4, site: 'Dordrecht', hazard: 'Flood', severity: 'Minor', issued: '2025-07-30 11:00 CET', summary: t('alerts.list.d1'), actions: t('alerts.list.d1_a') },
    { id: 5, site: 'Guwahati', hazard: 'Compound', severity: 'Extreme', issued: '2025-07-31 02:00 IST', summary: t('alerts.list.g2'), actions: t('alerts.list.g2_a') },
  ], [t]);

  const filteredAlerts = useMemo(() => {
    return allAlerts
      .filter(alert => filterSite === 'All' || alert.site === filterSite)
      .filter(alert => filterHazard === 'All' || alert.hazard === filterHazard)
      .sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);
  }, [allAlerts, filterSite, filterHazard]);

  const highSeverityCount = useMemo(() => {
    return filteredAlerts.filter(a => a.severity === 'Severe' || a.severity === 'Extreme').length;
  }, [filteredAlerts]);

  return (
    <div>
      <section className="hero-section-about">
        <div className="container">
          <h1 className="hero-title-about">{t('alerts.title')}</h1>
          <p className="hero-subtitle-about">{t('alerts.subtitle')}</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          {/* --- Filter and Summary Controls --- */}
          <div className="controls-container">
            <div className="alert-controls">
              <div className="filter-group">
                <FaFilter />
                <label>{t('alerts.filter_site')}</label>
                <select value={filterSite} onChange={(e) => setFilterSite(e.target.value)}>
                  <option value="All">{t('alerts.all')}</option>
                  <option value="Bengaluru">{t('alerts.siteNames.bengaluru')}</option>
                  <option value="Guwahati">{t('alerts.siteNames.guwahati')}</option>
                  <option value="Anantapur">{t('alerts.siteNames.anantapur')}</option>
                  <option value="Dordrecht">{t('alerts.siteNames.dordrecht')}</option>
                  <option value="Geertruidenberg">{t('alerts.siteNames.geertruidenberg')}</option>
                </select>
              </div>
              <div className="filter-group">
                <label>{t('alerts.filter_hazard')}</label>
                <select value={filterHazard} onChange={(e) => setFilterHazard(e.target.value)}>
                  <option value="All">{t('alerts.all')}</option>
                  <option value="Flood">{t('alerts.hazardNames.flood')}</option>
                  <option value="Drought">{t('alerts.hazardNames.drought')}</option>
                  <option value="Compound">{t('alerts.hazardNames.compound')}</option>
                </select>
              </div>
            </div>
            <div className="alert-summary">
              <div><span>{filteredAlerts.length}</span> {t('alerts.total_alerts', { count: filteredAlerts.length })}</div>
              <div className="summary-high-sev"><span>{highSeverityCount}</span> {t('alerts.high_alerts', { count: highSeverityCount })}</div>
            </div>
          </div>

          {/* --- Alerts Listing --- */}
          <motion.div
            className="alerts-list"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map(alert => (
                  <motion.div key={alert.id} variants={itemVariants} layout className={`alert-card-detailed sev-${alert.severity.toLowerCase()}`}>
                    <div className="alert-card-header">
                      <div className="alert-card-severity">
                        <FaExclamationCircle /> {t('alerts.severities.' + alert.severity.toLowerCase(), alert.severity)}
                      </div>
                      <div className="alert-card-location">
                        {t('alerts.siteNames.' + alert.site.toLowerCase(), alert.site)} - {t('alerts.hazardNames.' + alert.hazard.toLowerCase(), alert.hazard)} {t('alerts.hazard')}
                      </div>
                    </div>
                    <div className="alert-card-body">
                      <p className="alert-summary-text">{alert.summary}</p>
                      <div className="alert-actions">
                        <h4>{t('alerts.actions')}</h4>
                        <p>{alert.actions}</p>
                      </div>
                    </div>
                    <div className="alert-card-footer">Issued: {alert.issued}</div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="no-alerts-found"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <FaInfoCircle />
                  <p>{t('alerts.no_alerts')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
