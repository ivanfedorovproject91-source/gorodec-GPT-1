import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this repository from /gorodec-GPT-1/.
export default defineConfig({
  base: '/gorodec-GPT-1/',
  plugins: [react()],
});
