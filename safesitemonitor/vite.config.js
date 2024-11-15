import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: {
      '.js': 'jsx',  // Tell esbuild to treat .js files as .jsx files
    },
  },
  server: {
    port: 3001,  // Vite React app runs on port 3001
    proxy: {
      '/api': 'http://localhost:3000',  // Proxy API calls to the Node server on port 3000
    },
  },
});

