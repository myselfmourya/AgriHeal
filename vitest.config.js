import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: ['node_modules', 'dist', 'src/test'],
    },
    alias: {
      // Prevent tests from trying to resolve the real Supabase package —
      // they use a lightweight mock instead.
      '@supabase/supabase-js': path.resolve('./src/test/mocks/supabase.js'),
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
