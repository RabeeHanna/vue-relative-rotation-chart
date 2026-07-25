import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

/** SPA build for GitHub Pages / static demo hosting (C14). */
export default defineConfig({
  base: process.env.VITE_DEMO_BASE || '/vue-relative-rotation-chart/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'demo-dist',
    emptyOutDir: true,
  },
})
