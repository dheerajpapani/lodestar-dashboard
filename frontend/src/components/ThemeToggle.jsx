/* eslint-disable no-unused-vars */
// src/components/ThemeToggle.jsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import '../App.css';

export default function ThemeToggle() {
  // --- THIS IS THE KEY CHANGE ---
  // 1. Check if a theme is saved in localStorage.
  // 2. If NOT, default to light mode ('isDark' starts as false).
  // 3. If a theme IS saved, use that saved preference.
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem('theme') === 'dark'
  );

  // This useEffect hook is already correct and does not need changes.
  // It runs whenever 'isDark' changes, updating the page and saving the new preference.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div 
      className="theme-switch-sun-moon" 
      data-dark-mode={isDark} 
      onClick={() => setIsDark(!isDark)}
      title="Toggle theme"
    >
      <motion.div 
        className="theme-switch-handle" 
        layout 
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <div className="theme-switch-moon-crescent"></div>
      </motion.div>
    </div>
  );
}