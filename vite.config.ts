import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 'base: "./"' is critical for Android WebView to load assets (js/css) 
  // correctly from the file system (file:///android_asset/www/)
  base: './', 
  build: {
    outDir: 'dist',
  }
});