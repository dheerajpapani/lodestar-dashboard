/* eslint-disable no-unused-vars */
// src/pages/SeriousGames.jsx
import { useState } from 'react';
import { FaPuzzlePiece, FaPlay } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../App.css';

const liveGames = [
  {
    title: 'Stop Disasters! (UNDRR)',
    url: 'https://www.stopdisastersgame.org/game',
    blurb:
      'A multi-hazard simulation by UNDRR: protect cities from tsunami, earthquake, flood, wildfire and cyclone. Play online and test your risk-management strategy.',
    tags: ['Multi-hazard', 'Strategy', 'Risk reduction']
  },
  {
    title: 'Disaster Master (Ready.gov)',
    url: 'https://www.ready.gov/kids/games/data/dm-english/',
    blurb:
      'Youth-friendly game: face various disasters, build readiness and resilience through levels of play.',
    tags: ['Preparedness', 'Youth education', 'Hazard awareness']
  },
  {
    title: 'Build a Kit Game (Ready.gov)',
    url: 'https://www.ready.gov/kids/games/data/bak-english/index.html',
    blurb:
      'Interactive game where you build your emergency kit and choose how to act when disasters strike.',
    tags: ['Emergency kit', 'Decision making', 'Awareness']
  },
  {
    title: 'The Disaster Response Game (ISR/NYAS)',
    url: 'https://isr.nyas.org/games/disaster-response/',
    blurb:
      'Digital scenario game: wildfires, hurricanes, food-security crises. Hone rapid decision-making skills under pressure.',
    tags: ['Crisis response', 'Decision-making', 'Preparedness']
  },
];

export default function SeriousGames() {
  return (
    <div className="page-wrapper">
      <section className="hero-section-about">
        <div className="container">
          <h1 className="hero-title-about">Serious Games Hub</h1>
          <p className="hero-subtitle-about">
            Dive straight into playable games that explore disaster risk, resilience and strategic response.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <h2 className="section-title">Play These Real-World Disaster Risk Games</h2>
          <motion.div
            className="games-portfolio"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.15 }}
          >
            {liveGames.map((g) => (
              <motion.div
                key={g.title}
                className="game-card-detailed"
                variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
              >
                <div className="game-card-header">
                  <h3>{g.title}</h3>
                  <span className="game-status-tag">Playable Online</span>
                </div>
                <div className="game-card-body">
                  <p>{g.blurb}</p>
                  <div className="game-card-meta">
                    <div>
                      <FaPuzzlePiece /> <strong>Focus:</strong> {g.tags.join(', ')}
                    </div>
                  </div>
                </div>
                <div className="game-card-footer">
                  <a
                    className="cta-button"
                    href={g.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open game in new tab"
                  >
                    <FaPlay style={{ marginRight: 8 }} />
                    Play
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
