/* eslint-disable no-unused-vars */
// src/pages/SeriousGames.jsx
import { useState, useMemo } from 'react';
import { FaPuzzlePiece, FaPlay } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '../App.css';

export default function SeriousGames() {
  const { t } = useTranslation();

  const liveGames = useMemo(() => [
    {
      title: t('seriousGames.games.stopDisasters.title', 'Stop Disasters! (UNDRR)'),
      url: 'https://www.stopdisastersgame.org/game',
      blurb: t('seriousGames.games.stopDisasters.blurb', 'A multi-hazard simulation by UNDRR: protect cities from tsunami, earthquake, flood, wildfire and cyclone. Play online and test your risk-management strategy.'),
      tags: [t('seriousGames.tags.multiHazard', 'Multi-hazard'), t('seriousGames.tags.strategy', 'Strategy'), t('seriousGames.tags.riskReduction', 'Risk reduction')]
    },
    {
      title: t('seriousGames.games.disasterMaster.title', 'Disaster Master (Ready.gov)'),
      url: 'https://www.ready.gov/kids/games/data/dm-english/',
      blurb: t('seriousGames.games.disasterMaster.blurb', 'Youth-friendly game: face various disasters, build readiness and resilience through levels of play.'),
      tags: [t('seriousGames.tags.preparedness', 'Preparedness'), t('seriousGames.tags.youthEducation', 'Youth education'), t('seriousGames.tags.hazardAwareness', 'Hazard awareness')]
    },
    {
      title: t('seriousGames.games.buildKit.title', 'Build a Kit Game (Ready.gov)'),
      url: 'https://www.ready.gov/kids/games/data/bak-english/index.html',
      blurb: t('seriousGames.games.buildKit.blurb', 'Interactive game where you build your emergency kit and choose how to act when disasters strike.'),
      tags: [t('seriousGames.tags.emergencyKit', 'Emergency kit'), t('seriousGames.tags.decisionMaking', 'Decision making'), t('seriousGames.tags.awareness', 'Awareness')]
    },
    {
      title: t('seriousGames.games.disasterResponse.title', 'The Disaster Response Game (ISR/NYAS)'),
      url: 'https://isr.nyas.org/games/disaster-response/',
      blurb: t('seriousGames.games.disasterResponse.blurb', 'Digital scenario game: wildfires, hurricanes, food-security crises. Hone rapid decision-making skills under pressure.'),
      tags: [t('seriousGames.tags.crisisResponse', 'Crisis response'), t('seriousGames.tags.decisionMaking', 'Decision-making'), t('seriousGames.tags.preparedness', 'Preparedness')]
    },
  ], [t]);

  return (
    <div className="page-wrapper">
      <section className="hero-section-about">
        <div className="container">
          <h1 className="hero-title-about">{t('seriousGames.title', 'Serious Games Hub')}</h1>
          <p className="hero-subtitle-about">
            {t('seriousGames.subtitle', 'Dive straight into playable games that explore disaster risk, resilience and strategic response.')}
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="container-wide">
          <h2 className="section-title">{t('seriousGames.sectionTitle', 'Play These Real-World Disaster Risk Games')}</h2>
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
                  <span className="game-status-tag">{t('seriousGames.statusTag', 'Playable Online')}</span>
                </div>
                <div className="game-card-body">
                  <p>{g.blurb}</p>
                  <div className="game-card-meta">
                    <div>
                      <FaPuzzlePiece /> <strong>{t('seriousGames.focusLabel', 'Focus:')}</strong> {g.tags.join(', ')}
                    </div>
                  </div>
                </div>
                <div className="game-card-footer">
                  <a
                    className="cta-button"
                    href={g.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={t('seriousGames.playTitle', 'Open game in new tab')}
                  >
                    <FaPlay style={{ marginRight: 8 }} />
                    {t('seriousGames.playButton', 'Play')}
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
