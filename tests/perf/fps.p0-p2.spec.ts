import { test, expect } from '@playwright/test'
import {
  buildRunResult,
  playForMs,
  profileUrl,
  readUsedJsHeap,
  scrubTimeline,
  startFrameSampler,
  stopFrameSampler,
  stressEnv,
  writePerfArtifact,
  PERF_TARGET_FPS,
  type PerfProfileId,
} from './perfHarness'

async function runProfile(
  page: import('@playwright/test').Page,
  profile: PerfProfileId,
  interaction: 'scrub' | 'play',
  options?: { scrubSteps?: number; playMs?: number; note?: string },
) {
  const url = profileUrl(profile)
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 180_000 })
  await expect(page.getByTestId('rrg-chart')).toBeVisible({ timeout: 180_000 })
  await expect(page.getByTestId('rrg-playback')).toBeVisible()

  const heapBefore = await readUsedJsHeap(page)
  await startFrameSampler(page)
  if (interaction === 'scrub') {
    const steps =
      options?.scrubSteps ??
      (profile === 'P2' ? 60 : profile === 'stress-ceiling' ? stressEnv().scrubSteps : 30)
    await scrubTimeline(page, steps)
  } else {
    for (let i = 0; i < 3; i++) {
      await page.getByTestId('rrg-playback-speed-up').click()
    }
    const playMs =
      options?.playMs ??
      (profile === 'stress-ceiling'
        ? stressEnv().playMs
        : profile === 'P2'
          ? 2500
          : 1500)
    await playForMs(page, playMs)
  }
  const stamps = await stopFrameSampler(page)
  const heapAfter = await readUsedJsHeap(page)
  const result = buildRunResult(profile, interaction, url, stamps, {
    heap: { beforeBytes: heapBefore, afterBytes: heapAfter },
    note: options?.note,
  })
  const artifact = writePerfArtifact(result)
  console.log(`[perf] ${profile} ${interaction}`, result.metrics, '→', artifact)

  expect(result.metrics.frameCount).toBeGreaterThan(5)
  if (result.hardGate) {
    expect(result.metrics.avgFps).toBeGreaterThanOrEqual(PERF_TARGET_FPS)
  } else if (!result.meetsSoftTarget) {
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

test.describe('C17 FPS — stress ceiling (PERF_STRESS=1)', () => {
  test.beforeEach(() => {
    test.skip(
      process.env.PERF_STRESS !== '1',
      'Set PERF_STRESS=1 for generator ceiling (env: PERF_TICKERS/POINTS/PLAY_MS/…)',
    )
  })

  test('stress-ceiling scrub', async ({ page }) => {
    test.setTimeout(600_000)
    const s = stressEnv()
    const tailNodes = 2 * s.tickers
    await runProfile(page, 'stress-ceiling', 'scrub', {
      scrubSteps: s.scrubSteps,
      note: `document-only ceiling · ~${tailNodes} SVG tail nodes · T=${s.tickers} P=${s.points} fullHistory=${s.fullHistory}`,
    })
  })

  test('stress-ceiling play', async ({ page }) => {
    test.setTimeout(600_000)
    const s = stressEnv()
    const tailNodes = 2 * s.tickers
    await runProfile(page, 'stress-ceiling', 'play', {
      playMs: s.playMs,
      note: `document-only ceiling · ~${tailNodes} SVG tail nodes · playMs=${s.playMs} · T=${s.tickers} P=${s.points} fullHistory=${s.fullHistory}`,
    })
  })
})
