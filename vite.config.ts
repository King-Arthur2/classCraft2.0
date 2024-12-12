import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/classCraft2.0/', // Este debe coincidir con el nombre del repositorio en tu URL de GitHub Pages
});
