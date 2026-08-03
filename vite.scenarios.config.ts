import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { fileURLToPath, URL } from 'node:url'

function rewriteScenarioTypeImports(content: string): string {
  return content.replace(/from ['"]\.\.\/types\/rrg['"]/g, "from 'vue-relative-rotation-chart'")
}

/** ES-only scenarios subpath — second lib build pass after the main ESM/CJS bundle. */
export default defineConfig({
  publicDir: false,
  plugins: [
    dts({
      tsconfigPath: fileURLToPath(new URL('./tsconfig.build.json', import.meta.url)),
      entryRoot: 'src/scenarios',
      outDir: 'dist/scenarios',
      include: ['src/scenarios/**/*.ts'],
      rollupTypes: false,
      copyDtsFiles: false,
      beforeWriteFile: (filePath, content) => ({
        filePath,
        content: rewriteScenarioTypeImports(content),
      }),
    }),
  ],
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
