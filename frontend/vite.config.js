import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  envDir: '../', 
  plugins: [react()],
  base: '/lodestar-dashboard/',  // Set the base path for GitHub Pages
  build: {
    outDir: 'dist',  // Ensure the build output is placed into the 'dist' folder
  },
});
