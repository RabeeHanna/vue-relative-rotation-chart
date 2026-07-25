import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['spikes/**/*.test.ts', 'tests/**/*.test.ts'],
  },
})
