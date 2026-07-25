import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Page } from '@playwright/test'
import { computeFpsMetrics, type FpsMetrics } from './fpsMetrics'
import { PERF_TARGET_FPS } from './expectedTailNodes'

export type PerfProfileId = 'P0' | 'P2' | 'D3-ceiling'

export type PerfRunResult = {
  profile: PerfProfileId
  interaction: 'scrub' | 'play'
  url: string
  metrics: FpsMetrics
  targetFps: number
  meetsSoftTarget: boolean
  hardGate: boolean
  at: string
}

export function profileUrl(profile: PerfProfileId): string {
  switch (profile) {
    case 'P0':
      return '/?scenario=default&tailLength=10&labelMode=hover&viewportMode=fit&playbackLoop=true'
    case 'P2':
      return '/?scenario=longPlayback200&tailLength=10&labelMode=hover&viewportMode=fit&playbackLoop=true'
    case 'D3-ceiling':
      return '/?scenario=longPlayback100&fullHistoryTail=true&labelMode=hover&viewportMode=fit&playbackLoop=true'
  }
}

/** Start collecting rAF timestamps on the page. */
export async function startFrameSampler(page: Page): Promise<void> {
  await page.evaluate(() => {
    const w = window as unknown as {
      __rrgPerf?: { stamps: number[]; raf: number }
    }
    if (w.__rrgPerf?.raf) cancelAnimationFrame(w.__rrgPerf.raf)
    const stamps: number[] = []
    const tick = (t: number) => {
      stamps.push(t)
      w.__rrgPerf = { stamps, raf: requestAnimationFrame(tick) }
    }
    w.__rrgPerf = { stamps, raf: requestAnimationFrame(tick) }
  })
}

export async function stopFrameSampler(page: Page): Promise<number[]> {
  return page.evaluate(() => {
    const w = window as unknown as {
      __rrgPerf?: { stamps: number[]; raf: number }
    }
    if (w.__rrgPerf?.raf) cancelAnimationFrame(w.__rrgPerf.raf)
    const stamps = w.__rrgPerf?.stamps ?? []
    w.__rrgPerf = undefined
    return stamps
  })
}

/** Programmatic scrub across the range input (fires input events). */
export async function scrubTimeline(page: Page, steps = 40): Promise<void> {
  const scrubber = page.getByTestId('rrg-playback-scrubber')
  await scrubber.waitFor({ state: 'visible' })
  const max = Number(await scrubber.getAttribute('max'))
  const count = Math.max(2, Math.min(steps, max + 1))
  for (let i = 0; i < count; i++) {
    const value = Math.round((i / (count - 1)) * max)
    await scrubber.evaluate(
      (el, v) => {
        const input = el as HTMLInputElement
        input.value = String(v)
        input.dispatchEvent(new Event('input', { bubbles: true }))
      },
      value,
    )
    await page.waitForTimeout(16)
  }
  await scrubber.dispatchEvent('change')
}

export async function playForMs(page: Page, ms: number): Promise<void> {
  const toggle = page.getByTestId('rrg-playback-toggle')
  await toggle.click()
  await page.waitForTimeout(ms)
  const playing = await page.getByTestId('rrg-playback').getAttribute('data-playing')
  if (playing === 'true') await toggle.click()
}

export function writePerfArtifact(result: PerfRunResult, dir = 'test-results/perf'): string {
  mkdirSync(dir, { recursive: true })
  const name = `${result.profile}-${result.interaction}-${Date.now()}.json`
  const path = join(dir, name)
  writeFileSync(path, JSON.stringify(result, null, 2), 'utf8')
  return path
}

export function buildRunResult(
  profile: PerfProfileId,
  interaction: 'scrub' | 'play',
  url: string,
  stamps: number[],
): PerfRunResult {
  const metrics = computeFpsMetrics(stamps)
  const hardGate = process.env.PERF_HARD_GATE === '1'
  return {
    profile,
    interaction,
    url,
    metrics,
    targetFps: PERF_TARGET_FPS,
    meetsSoftTarget: metrics.avgFps >= PERF_TARGET_FPS,
    hardGate,
    at: new Date().toISOString(),
  }
}

export { PERF_TARGET_FPS }
