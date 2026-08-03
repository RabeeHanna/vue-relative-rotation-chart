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
      include: ['src/index.ts'],
      exclude: ['src/scenarios/**'],
      rollupTypes: true,
      copyDtsFiles: false,
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
      formats: ['es', 'cjs'],
      fileName: (format) =>
        format === 'es' ? 'vue-relative-rotation-chart.js' : 'vue-relative-rotation-chart.cjs',
    },
    rollupOptions: {
      external: ['vue', 'd3-array', 'd3-scale'],
      output: {
        exports: 'named',
      },
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
    root: rootDir,
  },
})
