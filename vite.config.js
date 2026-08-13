import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // emptyOutDir disabled: the sandbox's safe-delete hook blocks Vite from
  // trashing the old dist/, so we overwrite in place instead.
  build: { emptyOutDir: false },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
