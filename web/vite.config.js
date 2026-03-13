import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/frameworks/',
  server: {
    port: 8080,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
