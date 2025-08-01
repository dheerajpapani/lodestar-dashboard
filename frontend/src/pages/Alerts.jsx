/* eslint-disable no-unused-vars */
// src/pages/Alerts.jsx
import { useState, useMemo } from 'react';
import { FaExclamationCircle, FaFilter, FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import '../App.css';

const allAlerts = [
  { id: 1, site: 'Guwahati', hazard: 'Flood', severity: 'Severe', issued: '2025-07-31 01:00 IST', summary: 'Brahmaputra river has crossed the warning level due to heavy upstream rainfall.', actions: 'Evacuate low-lying areas near the riverbank. Move valuables to higher ground. Follow instructions from ASDMA.' },
  { id: 2, site: 'Anantapur', hazard: 'Drought', severity: 'Moderate', issued: '2025-07-30 10:00 IST', summary: 'Below-average monsoon rainfall continues. Soil moisture is critically low.', actions: 'Implement water conservation measures. Farmers are advised to consider drought-resistant crops.' },
  { id: 3, site: 'Bengaluru', hazard: 'Flood', severity: 'Moderate', issued: '2025-07-31 00:30 IST', summary: 'Intense short-duration rainfall expected, leading to high risk of urban waterlogging.', actions: 'Avoid travel in low-lying areas and underpasses. Ensure storm drains are clear of debris.' },
  { id: 4, site: 'Dordrecht', hazard: 'Flood', severity: 'Minor', issued: '2025-07-30 11:00 CET', summary: 'River levels are elevated due to North Sea tidal surge but are expected to remain below flood stage.', actions: 'Monitor water levels and be aware of potential for minor coastal flooding.' },
  { id: 5, site: 'Guwahati', hazard: 'Compound', severity: 'Extreme', issued: '2025-07-31 02:00 IST', summary: 'Compound Event: Fluvial flooding from the river is now combined with pluvial (rainfall) flooding, overwhelming city drainage.', actions: 'This is a high-risk situation. Seek shelter on higher floors or designated evacuation centers immediately.' },
];
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
  const [filterSite, setFilterSite] = useState('All');
  const [filterHazard, setFilterHazard] = useState('All');

  const filteredAlerts = useMemo(() => {
    return allAlerts
      .filter(alert => filterSite === 'All' || alert.site === filterSite)
      .filter(alert => filterHazard === 'All' || alert.hazard === filterHazard)
      .sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);
  }, [filterSite, filterHazard]);
  
  const highSeverityCount = useMemo(() => {
      return filteredAlerts.filter(a => a.severity === 'Severe' || a.severity === 'Extreme').length;
  }, [filteredAlerts]);

  return (
    <div>
      <section className="hero-section-about">
        <div className="container">
            <h1 className="hero-title-about">LODESTAR Alert Center</h1>
            <p className="hero-subtitle-about">A centralized hub for real-time, multi-hazard early warnings for our study sites in India and the Netherlands.</p>
        </div>
      </section>
      
      <section className="page-section">
          <div className="container">
            {/* --- Filter and Summary Controls --- */}
            <div className="controls-container">
                <div className="alert-controls">
                    <div className="filter-group">
                        <FaFilter />
                        <label>Filter by Site:</label>
                        <select value={filterSite} onChange={(e) => setFilterSite(e.target.value)}>
                            <option>All</option> <option>Bengaluru</option> <option>Guwahati</option>
                            <option>Anantapur</option> <option>Dordrecht</option> <option>Tilburg & Breda</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Filter by Hazard:</label>
                        <select value={filterHazard} onChange={(e) => setFilterHazard(e.target.value)}>
                            <option>All</option> <option>Flood</option>
                            <option>Drought</option> <option>Compound</option>
                        </select>
                    </div>
                </div>
                <div className="alert-summary">
                    <div><span>{filteredAlerts.length}</span> Total Active Alerts</div>
                    <div className="summary-high-sev"><span>{highSeverityCount}</span> High-Severity Alerts</div>
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
                        <div className="alert-card-severity"><FaExclamationCircle /> {alert.severity}</div>
                        <div className="alert-card-location">{alert.site} - {alert.hazard} Hazard</div>
                      </div>
                      <div className="alert-card-body">
                        <p className="alert-summary-text">{alert.summary}</p>
                        <div className="alert-actions">
                          <h4>Recommended Actions:</h4>
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
                    <p>No active alerts match your current filter settings.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
      </section>
    </div>
  );
}
