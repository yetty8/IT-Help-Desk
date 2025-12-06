import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Vite's default output directory
  },
  server: {
    port: 5173, // optional, useful for local dev
    strictPort: true,
  },
});