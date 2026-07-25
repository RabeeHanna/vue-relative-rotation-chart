import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

/** ES-only scenarios subpath — second pass so main can keep UMD (C14). */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    emptyOutDir: false,
    lib: {
      entry: fileURLToPath(new URL('./src/scenarios/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: () => 'scenarios.js',
    },
    rollupOptions: {
      external: ['vue'],
    },
  },
})
