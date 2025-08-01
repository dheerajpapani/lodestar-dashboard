// src/pages/Admin.jsx
import { useState } from 'react';
import '../App.css';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
    } else {
      // In a real app, you'd show a message, not an alert.
      // For this prototype, an alert is fine, but we avoid it.
      console.error("Invalid credentials");
    }
  };

  return (
    <div>
      <section className="hero-section-about">
        <div className="container">
          <h1 className="hero-title-about">Admin Dashboard</h1>
          <p className="hero-subtitle-about">Content Management Panel</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          {!isLoggedIn ? (
            <form className="admin-login-form" onSubmit={handleLogin}>
              <h3>Consortium Login</h3>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="cta-button">Login</button>
            </form>
          ) : (
            <div className="admin-controls">
              <div className="admin-card">
                <h4>Data Management</h4>
                <p>Push new real-time alerts to the EWS or update existing ones.</p>
                <button className="cta-button">Update Alerts</button>
              </div>
              <div className="admin-card">
                <h4>Upload Reports</h4>
                <p>Add new publications or project deliverables to the Research Hub.</p>
                <input type="file" />
              </div>
              <div className="admin-card">
                <h4>Living Lab Management</h4>
                <p>Update workshop schedules and post citizen science results.</p>
                <button className="cta-button">Manage Labs</button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
