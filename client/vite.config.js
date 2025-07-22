// client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/price': 'http://localhost:8000',
      '/sentiment': 'http://localhost:8000',
      '/trend': 'http://localhost:8000',
      '/movers': 'http://localhost:8000',
    },
  },
});
