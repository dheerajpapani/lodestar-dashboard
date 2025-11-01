// frontend/vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Force-load .env from the frontend folder and inject VITE_* vars
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ''); // loads .env, .env.local, etc. from ./frontend
  return defineConfig({
    plugins: [react()],
    envPrefix: 'VITE_',     // ensure only VITE_* are exposed
    envDir: process.cwd(),  // make absolutely sure we're using ./frontend as env dir
    define: {
      // Hard-inject the keys so import.meta.env.* is never empty at runtime
      'import.meta.env.VITE_MAPTILER_KEY': JSON.stringify(env.VITE_MAPTILER_KEY || ''),
      'import.meta.env.VITE_OPENWEATHERMAP_KEY': JSON.stringify(env.VITE_OPENWEATHERMAP_KEY || ''),
    },
  });
};
