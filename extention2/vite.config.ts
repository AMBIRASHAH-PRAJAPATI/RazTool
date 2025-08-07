import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true, // Ensure a clean build directory
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        content: resolve(__dirname, 'src/content.tsx'),
        background: resolve(__dirname, 'src/background.ts'),
      },
      output: {
        // Ensure that each entry point is outputted to the root of the dist folder
        entryFileNames: '[name].js',
        // Also ensure that the manifest.json and other assets are in the root
        assetFileNames: '[name].[ext]',
        dir: 'dist',
      },
    },
  },
});