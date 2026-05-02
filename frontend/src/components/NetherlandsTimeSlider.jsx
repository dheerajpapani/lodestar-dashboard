import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaPlay, FaPause, FaStepBackward } from 'react-icons/fa';

// Only COG-converted files from sentinel_cog folder
const VALID_DATES = [
  { label: '11 Jun', sublabel: '2023-06-11', file: '2023-06-11_cog.tiff' },
  { label: '16 Jun', sublabel: '2023-06-16', file: '2023-06-16_cog.tiff' },
  { label: '28 Jun', sublabel: '2023-06-28', file: '2023-06-28_cog.tiff' },
  { label: '30 Jun', sublabel: '2023-06-30', file: '2023-06-30_cog.tiff' },
  { label: '05 Jul', sublabel: '2023-07-05', file: '2023-07-05_cog.tiff' },
  { label: '22 Jul', sublabel: '2023-07-22', file: '2023-07-22_cog.tiff' },
];

export default function NetherlandsTimeSlider({ onDateChange, isLoading }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);
  const pendingUpdateRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());

  // Keep a stable ref to onDateChange so it never causes re-renders
  // when the parent re-renders with a new function reference
  const onDateChangeRef = useRef(onDateChange);
  useEffect(() => { onDateChangeRef.current = onDateChange; });

  // Trigger update when index changes — only fires on actual index changes,
  // not on every parent re-render (onDateChange is accessed via ref)
  useEffect(() => {
    const selected = VALID_DATES[currentIndex];
    const now = Date.now();
    if (now - lastUpdateRef.current < 300) {
      if (pendingUpdateRef.current) clearTimeout(pendingUpdateRef.current);
      pendingUpdateRef.current = setTimeout(() => {
        onDateChangeRef.current(selected.file, selected.label);
        lastUpdateRef.current = Date.now();
      }, 300);
    } else {
      onDateChangeRef.current(selected.file, selected.label);
      lastUpdateRef.current = now;
    }
  }, [currentIndex]); // ← stable: onDateChange accessed via ref, not dep array


  // Play animation — advances one step every 2s (crossfade is 600ms, so ~1.4s visible per frame)
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= VALID_DATES.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      // Pause
      setIsPlaying(false);
    } else {
      // Always start from beginning
      setCurrentIndex(0);
      setIsPlaying(true);
    }
  }, [isPlaying]);

  return (
    <div style={styles.container}>
      {/* Play / Pause button */}
      <button
        style={{ ...styles.iconBtn, backgroundColor: isPlaying ? '#ef4444' : '#3b82f6' }}
        onClick={handlePlay}
        title={isPlaying ? 'Pause' : 'Play from start'}
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>

      {/* Day chips + progress bar */}
      <div style={styles.track}>
        {/* Clickable day chips */}
        <div style={styles.chipsRow}>
          {VALID_DATES.map((d, i) => {
            const isActive = currentIndex === i;
            return (
              <button
                key={i}
                onClick={() => { setIsPlaying(false); setCurrentIndex(i); }}
                style={{
                  ...styles.chip,
                  backgroundColor: isActive ? '#3b82f6' : 'rgba(255,255,255,0.07)',
                  color: isActive ? '#fff' : '#94a3b8',
                  border: isActive ? '1.5px solid #60a5fa' : '1.5px solid transparent',
                  transform: isActive ? 'scale(1.08)' : 'scale(1)',
                  boxShadow: isActive ? '0 0 10px rgba(59,130,246,0.5)' : 'none',
                }}
                title={d.sublabel}
              >
                {d.label}
              </button>
            );
          })}
        </div>

        {/* Progress connector bar */}
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${(currentIndex / (VALID_DATES.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div style={styles.loadingDot} title="Loading raster...">
          <span style={styles.loadingPulse} />
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    padding: '14px 20px',
    borderRadius: '14px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    border: '1px solid rgba(255,255,255,0.1)',
    width: '100%',
    maxWidth: '680px',
    backdropFilter: 'blur(12px)',
  },
  iconBtn: {
    border: 'none',
    color: 'white',
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '1rem',
    flexShrink: 0,
    transition: 'background-color 0.2s, transform 0.15s',
    boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
  },
  track: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  chipsRow: {
    display: 'flex',
    gap: '6px',
    justifyContent: 'space-between',
  },
  chip: {
    flex: 1,
    padding: '6px 4px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.78rem',
    fontWeight: '700',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    letterSpacing: '0.02em',
  },
  progressBar: {
    height: '4px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    backgroundColor: '#3b82f6',
    transition: 'width 0.4s ease',
  },
  loadingDot: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  loadingPulse: {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#fbbf24',
    animation: 'pulse 1s infinite',
  },
};
