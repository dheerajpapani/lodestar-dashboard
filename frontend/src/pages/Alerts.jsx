import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const sampleAlerts = [
      {
        id: 1,
        type: 'Flood Warning',
        location: 'Bengaluru',
        level: 'High',
        issued: '2024-07-01 14:00',
        details: 'Heavy rainfall expected. River levels rising rapidly.',
      },
      {
        id: 2,
        type: 'Drought Watch',
        location: 'Anantapur',
        level: 'Moderate',
        issued: '2024-06-30 10:00',
        details: 'Below average rainfall for the past 3 weeks.',
      },
    ];
    setAlerts(sampleAlerts);
  }, []);

  return (
    <div className="alerts-wrapper">
      <header className="alerts-header">
        <h1>🚨 Active Alerts</h1>
        <p>Real-time alerts for flood and drought risks.</p>
      </header>

      <div className="alerts-grid">
        {alerts.length > 0 ? (
          alerts.map(alert => (
            <div key={alert.id} className={`alert-card level-${alert.level.toLowerCase()}`}>
              <h3>{alert.type}</h3>
              <p><strong>Location:</strong> {alert.location}</p>
              <p><strong>Severity:</strong> {alert.level}</p>
              <p><strong>Issued:</strong> {alert.issued}</p>
              <p>{alert.details}</p>
            </div>
          ))
        ) : (
          <p className="no-data">No alerts at this moment.</p>
        )}
      </div>

      <div className="back-link">
        <Link to="/" className="link-btn">🏠 Back to Home</Link>
      </div>
    </div>
  );
}
