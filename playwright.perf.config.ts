import { defineConfig, devices } from '@playwright/test'

const PORT = 5175
const BASE_URL = `http://127.0.0.1:${PORT}`

/**
 * C17 Layer B — browser FPS harness (Chromium only).
 * Not part of default PR e2e; run via `npm run test:perf` (nightly / manual).
 */
export default defineConfig({
  testDir: 'tests/perf',
  testMatch: /.*\.spec\.ts/,
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: 'test-results/perf/playwright-report.json' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'off',
  },
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
