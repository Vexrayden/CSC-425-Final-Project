import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  esbuild: {
    jsxInject: `import React from 'react'`, // Automatically inject React for JSX
  },
  server: {
    port: 3001, // Vite React app runs on port 3001
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Proxy API calls to the Node server on port 3000
        changeOrigin: true,
      },
    },
    historyApiFallback: true, // Ensure React app routes work in the browser
  },
});




