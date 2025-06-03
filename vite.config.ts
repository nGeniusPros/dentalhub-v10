import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ["@supabase/supabase-js"],
    exclude: ['lucide-react'],
  },
  define: {
    // Ensure environment variables are properly handled
    // This is only for backward compatibility with process.env references
    'process.env': {}
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 5173
    },
    proxy: {
      // More specific rule for /api/dashboard/*
      // This will take /api/dashboard/revenue and map it to /.netlify/functions/revenue
      '/api/dashboard': {
        target: 'http://localhost:56847/.netlify/functions',
        changeOrigin: true,
        secure: false, // Often good to include for localhost targets
        rewrite: (path) => path.replace(/^\/api\//, '/') 
      },
      // General /api rule for other calls like /api/nexhealth/test
      // This will take /api/nexhealth/test and map it to /.netlify/functions/nexhealth/test
      '/api': {
        target: 'http://localhost:56847/.netlify/functions',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // This rule for '/.netlify/functions' still looks a bit unconventional.
      // Standard Netlify Dev serves functions at `http://localhost:9999/.netlify/functions/YOUR_FUNCTION_NAME`.
      // This rule rewrites `/.netlify/functions/foo` to `/foo` and targets `http://localhost:9999`.
      // So it would request `http://localhost:9999/foo`.
      // It's not causing the current /api/dashboard 404, but you might want to review if it's needed or correctly configured.
      // If your frontend never calls `/.netlify/functions/...` directly, you might not need it.
      '/.netlify/functions': {
        target: 'http://localhost:9999',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/\.netlify\/functions/, '')
      }
    }
  }
});
