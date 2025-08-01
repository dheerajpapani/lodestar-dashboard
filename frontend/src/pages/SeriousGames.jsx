/* eslint-disable no-unused-vars */
// src/pages/SeriousGames.jsx
import { useState } from 'react';
import { FaUsers, FaPuzzlePiece, FaBrain } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ComingSoonBox from '../components/ComingSoonBox';
import '../App.css';

const gamePortfolio = [
  {
    title: 'The Evacuation Challenge',
    scenario: 'Based on the Dordrecht study site, an extreme flood is imminent as the city\'s East dike is at risk of breaking. Players must coordinate the evacuation of the population, including those with special needs, to designated self-sufficient shelter areas.',
    learningGoals: ['Collaborative Planning', 'Resource Management', 'Decision-Making Under Pressure'],
    targetAudience: 'Municipal Planners, Citizens, Emergency Responders',
    status: 'Concept in Development'
  },
  {
    title: 'Drought & The City',
    scenario: 'In the Tilburg-Breda region, a multi-year drought is stressing water supplies for new residential developments. Players, representing water boards, city authorities, and citizens, must negotiate and implement green and grey infrastructure solutions.',
    learningGoals: ['Negotiation & Trade-offs', 'Long-term Strategic Planning', 'Understanding Nature-Based Solutions'],
    targetAudience: 'Policy Makers, Urban Developers, Community Groups',
    status: 'Concept Phase'
  },
  {
    title: 'Compound Crisis: Guwahati',
    scenario: 'The city is hit by a compound disaster: the Brahmaputra river is causing fluvial (river) flooding, while intense monsoon rain causes pluvial (rainfall) flooding, overwhelming urban drainage. Players must manage a multi-faceted response.',
    learningGoals: ['Understanding Compound Risks', 'Integrated Response Coordination', 'Citizen Science Integration'],
    targetAudience: 'Disaster Management Agencies, Students, NGOs',
    status: 'Concept Phase'
  }
];

export default function SeriousGames() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ComingSoonBox isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="page-wrapper">
        <section className="hero-section-about">
          <div className="container">
            <h1 className="hero-title-about">Serious Games Hub</h1>
            <p className="hero-subtitle-about">
              Interactive tools for collaborative learning and strategy development in disaster management.
            </p>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <h2 className="section-title">Why We Use Serious Games</h2>
            <div className="text-block">
              <p>Serious games are more than just entertainment; they are a creative and powerful method to trigger people's intelligence and tap into their historical and recent knowledge of disaster events. Within our Living Labs, these games provide a dynamic platform for learning and strategy testing in a risk-free environment.</p>
              <p>They are designed to make complex concepts more understandable, promote critical thinking, and foster collaboration among diverse groups—from government officials to the public. By simulating extreme scenarios, we can co-create and test alternative disaster responses together.</p>
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <h2 className="section-title">Our Games Portfolio</h2>
            <motion.div 
              className="games-portfolio"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ staggerChildren: 0.2 }}
            >
              {gamePortfolio.map(game => (
                <motion.div 
                  key={game.title} 
                  className="game-card-detailed"
                  variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
                >
                  <div className="game-card-header">
                    <h3>{game.title}</h3>
                    <span className="game-status-tag">{game.status}</span>
                  </div>
                  <div className="game-card-body">
                    <h4>Scenario:</h4>
                    <p>{game.scenario}</p>
                    <div className="game-card-meta">
                      <div>
                        <FaBrain /> <strong>Learning Goals:</strong> {game.learningGoals.join(', ')}
                      </div>
                      <div>
                        <FaUsers /> <strong>Target Audience:</strong> {game.targetAudience}
                      </div>
                    </div>
                  </div>
                  <div className="game-card-footer">
                    <button className="cta-button" onClick={() => setIsModalOpen(true)}>Play Demo</button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
