import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const games = [
  {
    title: '🛰️ Earth Now – NASA Visualization',
    description: 'Track real-time global climate indicators from NASA.',
    src: 'https://climate.nasa.gov/interactives/climate-time-machine/',
  },
  {
    title: '🔄 Water Cycle Explorer',
    description: 'Learn about the water cycle with interactive animations.',
    src: 'https://gpm.nasa.gov/education/water-cycle-game',
  },
  {
    title: '🌀 Hurricane Simulation Game',
    description: 'Explore how hurricanes are formed and their impacts.',
    src: 'https://scijinks.gov/hurricane-simulation/',
  },
];


export default function Games() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="games-wrapper">
      <div className="section-hero">
        <h1 className="section-title">🎮 Hazard Education Games</h1>
        <p className="section-subtitle">
          Explore climate, flood, and disaster‑themed games to boost awareness while having fun!
        </p>
      </div>

      <div className="game-grid">
        {games.map(({ title, description }, idx) => (
          <div
            key={idx}
            className="game-card"
            onClick={() => setActiveIndex(idx)}
          >
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="game-modal"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setActiveIndex(null)}
            >
              ✕
            </button>
            <h2 className="modal-title">{games[activeIndex].title}</h2>
            <div className="modal-frame">
              <iframe
                src={games[activeIndex].src}
                title={games[activeIndex].title}
                width="100%"
                height="100%"
                allow="fullscreen"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      <Link to="/" className="section-back-btn">🏠 Back to Home</Link>
    </div>
  );
}
