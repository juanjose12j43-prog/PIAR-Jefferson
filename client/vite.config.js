import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite: proxy hacia el backend Express en desarrollo
export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT) || 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
