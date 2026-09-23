import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  server: {
    host: '127.0.0.1',
    port: 5180,
  },
  preview: {
    host: '127.0.0.1',
    port: 5180,
  },
});
