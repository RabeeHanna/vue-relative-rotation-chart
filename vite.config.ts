/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { fileURLToPath, URL } from 'node:url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  publicDir: false,
  plugins: [
    vue(),
    dts({
      tsconfigPath: fileURLToPath(new URL('./tsconfig.build.json', import.meta.url)),
      entryRoot: 'src',
      outDir: 'dist',
      include: ['src'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'VueRelativeRotationChart',
      formats: ['es', 'umd'],
      fileName: (format) =>
        format === 'es' ? 'vue-relative-rotation-chart.js' : 'vue-relative-rotation-chart.umd.cjs',
    },
    rollupOptions: {
      external: ['vue', 'd3-array', 'd3-scale'],
      output: {
        globals: {
          vue: 'Vue',
          'd3-array': 'd3',
          'd3-scale': 'd3',
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts', 'spikes/**/*.test.ts'],
    root: rootDir,
  },
})
