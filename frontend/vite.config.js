// frontend/vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Force-load .env from the frontend folder and inject VITE_* vars
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ''); // loads .env, .env.local, etc. from ./frontend
  return defineConfig({
    plugins: [react()],
    base: '/lodestar-dashboard/',
    envPrefix: 'VITE_',     // ensure only VITE_* are exposed
    envDir: process.cwd(),  // make absolutely sure we're using ./frontend as env dir
    define: {
      // Hard-inject the keys so import.meta.env.* is never empty at runtime
      'import.meta.env.VITE_MAPTILER_KEY': JSON.stringify(env.VITE_MAPTILER_KEY || ''),
      'import.meta.env.VITE_OPENWEATHERMAP_KEY': JSON.stringify(env.VITE_OPENWEATHERMAP_KEY || ''),
      'import.meta.env.VITE_BHUVAN_LULC_KEY': JSON.stringify(env.VITE_BHUVAN_LULC_KEY || ''),
    },
    server: {
      proxy: {
        // Proxy Bhuvan API calls to avoid CORS in dev
        '/bhuvan-api': {
          target: 'https://bhuvan-app1.nrsc.gov.in/api',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/bhuvan-api/, ''),
        },
      },
    },
  });
};
