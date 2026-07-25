import { test, expect } from '@playwright/test'
import {
  buildRunResult,
  playForMs,
  profileUrl,
  scrubTimeline,
  startFrameSampler,
  stopFrameSampler,
  writePerfArtifact,
  PERF_TARGET_FPS,
  type PerfProfileId,
} from './perfHarness'

async function runProfile(
  page: import('@playwright/test').Page,
  profile: PerfProfileId,
  interaction: 'scrub' | 'play',
) {
  const url = profileUrl(profile)
  await page.goto(url)
  await expect(page.getByTestId('rrg-chart')).toBeVisible()
  await expect(page.getByTestId('rrg-playback')).toBeVisible()

  await startFrameSampler(page)
  if (interaction === 'scrub') {
    await scrubTimeline(page, profile === 'P2' ? 60 : 30)
  } else {
    // Speed up slightly so play covers more frames in a short window.
    for (let i = 0; i < 3; i++) {
      await page.getByTestId('rrg-playback-speed-up').click()
    }
    await playForMs(page, profile === 'P2' ? 2500 : 1500)
  }
  const stamps = await stopFrameSampler(page)
  const result = buildRunResult(profile, interaction, url, stamps)
  const artifact = writePerfArtifact(result)
  console.log(`[perf] ${profile} ${interaction}`, result.metrics, '→', artifact)

  expect(result.metrics.frameCount).toBeGreaterThan(5)
  if (result.hardGate) {
    expect(result.metrics.avgFps).toBeGreaterThanOrEqual(PERF_TARGET_FPS)
  } else if (!result.meetsSoftTarget) {
    // Soft: warn only — shared CI CPU is not a hard gate (C17 locked decision).
    console.warn(
      `[perf] soft miss: ${profile} ${interaction} avgFps=${result.metrics.avgFps} (target ${PERF_TARGET_FPS})`,
    )
  }
  return result
}

test.describe('C17 FPS — must-pass profiles (soft ≥55)', () => {
  for (const profile of ['P0', 'P2'] as const) {
    test(`${profile} scrub`, async ({ page }) => {
      await runProfile(page, profile, 'scrub')
    })
    test(`${profile} play`, async ({ page }) => {
      await runProfile(page, profile, 'play')
    })
  }
})

test.describe('C17 FPS — document-only / ceiling', () => {
  test('D3-ceiling full-history scrub (nightly when PERF_CEILING=1)', async ({ page }) => {
    test.skip(process.env.PERF_CEILING !== '1', 'Set PERF_CEILING=1 for nightly/manual ceiling probe')
    await runProfile(page, 'D3-ceiling', 'scrub')
  })
})
