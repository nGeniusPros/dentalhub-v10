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
    }
  }
});
