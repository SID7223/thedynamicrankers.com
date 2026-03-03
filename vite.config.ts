import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react-icons/fa'],
  },
  server: {
    proxy: {
      '/api/internal': {
        target: 'http://localhost:8788', // Standard Wrangler Pages Dev port
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
