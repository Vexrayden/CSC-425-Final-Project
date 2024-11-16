import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config with proxy setup for your backend and JSX automatic injection
export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsxInject: `import React from 'react'`,  // Automatically inject React for JSX (React 17+)
  },
  server: {
    port: 3001,  // Vite React app runs on port 3001
    proxy: {
      '/api': 'http://localhost:3000',  // Proxy API calls to the Node server on port 3000
      '/auth': 'http://localhost:3000', // If you're using auth API routes, make sure they're proxied too
    },
    historyApiFallback: true,
  },
});


