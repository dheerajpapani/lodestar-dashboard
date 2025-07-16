// src/pages/Admin.jsx
import { useState } from 'react';
import '../App.css';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="admin-wrapper">
      <h2 className="admin-title">Admin Dashboard</h2>

      {!isLoggedIn ? (
        <div className="admin-login">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div className="admin-controls">
          <div className="admin-card">
            <h4>Data Management</h4>
            <button>Sync Latest Data</button>
          </div>

          <div className="admin-card">
            <h4>Upload Reports</h4>
            <input type="file" />
          </div>

          <div className="admin-card">
            <h4>Module Visibility</h4>
            <label><input type="checkbox" defaultChecked /> Forecasts</label>
            <label><input type="checkbox" /> Alerts</label>
            <label><input type="checkbox" defaultChecked /> Community</label>
          </div>
        </div>
      )}
    </div>
  );
}
