// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import '../App.css';

export default function NotFound() {
  return (
    <div className="notfound-wrapper">
      <div className="notfound-content">
        <img
          src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
          alt="Lost map"
          className="notfound-img"
        />
        <h1 className="notfound-title">Lost in the Forecast?</h1>
        <p className="notfound-subtitle">
          The page you're looking for is off the radar or hasn't been charted yet.
        </p>
        <Link to="/" className="notfound-btn">Return to Dashboard</Link>
      </div>
    </div>
  );
}
