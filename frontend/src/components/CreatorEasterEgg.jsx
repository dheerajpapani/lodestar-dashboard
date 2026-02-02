/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FaGithub, FaLinkedin, FaEnvelope, FaTimes } from 'react-icons/fa';
import '../App.css'; // Ensure we have access to variables if needed

const COOLDOWN_MS = 5 * 60 * 1000; // 5 Minutes
const CLICK_THRESHOLD_MS = 1000; // Reset clicks if idle for 1s
const REQUIRED_CLICKS = 4;

// ... imports kept same, structure changing ...
export default function CreatorEasterEgg({ children }) {
    const [clickCount, setClickCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [canClose, setCanClose] = useState(false);

    // --- 1. Console Signature ---
    useEffect(() => {
        const signature = `
    %c   ___  ____ __  __
    %c  |   \\| __|\\ \\ / /
    %c  | |) | _|  \\ V /    DHEERAJ PAPANI
    %c  |___/|___|  \\_/     Architect & Developer
    %c                      https://github.com/dheerajpapani
    `;
        console.log(signature, 'color: #3b82f6', 'color: #3b82f6', 'color: #3b82f6', 'color: #3b82f6', 'color: gray; font-style: italic;');
    }, []);

    // --- 2. Trigger Logic ---
    useEffect(() => {
        const timer = setTimeout(() => setClickCount(0), 1000);
        return () => clearTimeout(timer);
    }, [clickCount]);

    const handleInteraction = useCallback((e) => {
        e.preventDefault();
        setClickCount((prev) => {
            const newCount = prev + 1;
            if (newCount === 4) {
                triggerEasterEgg();
                return 0;
            }
            return newCount;
        });
    }, []);

    const triggerEasterEgg = () => {
        setIsOpen(true);
        setCanClose(false);
        setTimeout(() => setCanClose(true), 2500);

        // Confetti
        const end = Date.now() + 3000;
        (function frame() {
            // High zIndex to appear ON TOP of the overlay (which is 10000)
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#3b82f6', '#60a5fa', '#ffffff'],
                zIndex: 10001
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#3b82f6', '#60a5fa', '#ffffff'],
                zIndex: 10001
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        })();
    };

    return (
        <>
            <div onClick={handleInteraction} style={{ cursor: 'pointer', display: 'inline-block' }}>{children}</div>

            <AnimatePresence>
                {isOpen && (
                    <div className="easter-egg-overlay" onClick={() => canClose && setIsOpen(false)} style={{ cursor: canClose ? 'pointer' : 'default' }}>
                        <div className="container noselect" onClick={(e) => e.stopPropagation()}>
                            <div className="canvas">
                                {/* 25 Trackers for CSS-only Tilt */}
                                {[...Array(25)].map((_, i) => (
                                    <div key={i} className={`tracker tr-${i + 1}`}></div>
                                ))}

                                <div id="card">
                                    <p id="prompt">DEVELOPER</p>

                                    <div className="logo-3d">
                                        <div className="circle circle1"></div>
                                        <div className="circle circle2"></div>
                                        <div className="circle circle3"></div>
                                        <div className="circle circle4"></div>
                                    </div>

                                    <div className="glass"></div>

                                    <div className="content">
                                        <span className="title">DHEERAJ PAPANI</span>
                                        <span className="text">Architect & Developer<br />Built with precision and a touch of magic.</span>
                                    </div>

                                    <div className="bottom">
                                        <div className="social-buttons-container">
                                            <a href="https://github.com/dheerajpapani" target="_blank" className="social-button">
                                                <FaGithub />
                                            </a>
                                            <a href="https://linkedin.com/in/dheerajpapani" target="_blank" className="social-button">
                                                <FaLinkedin />
                                            </a>
                                            <a href="mailto:dheerajpapani@gmail.com" className="social-button">
                                                <FaEnvelope />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
