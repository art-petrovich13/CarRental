import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
 
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: [
          'localhost',
          '.trycloudflare.com'
        ],
    proxy: {
      '/api': {
        target: 'https://localhost:7231',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
