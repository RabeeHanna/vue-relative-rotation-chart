/**
 * In-browser FPS sampler for the demo “Run perf sample” button.
 * Convenience only — Playwright `tests/perf` is the source of truth (C17).
 */

export type DemoPerfSample = {
  interaction: 'scrub' | 'play'
  frameCount: number
  avgFps: number
  minFps: number
  p95FrameMs: number
  durationMs: number
  at: string
}

function metricsFromStamps(stamps: number[]) {
  if (stamps.length < 2) {
    return { frameCount: stamps.length, avgFps: 0, minFps: 0, p95FrameMs: 0, durationMs: 0 }
  }
  const deltas: number[] = []
  for (let i = 1; i < stamps.length; i++) {
    const d = stamps[i]! - stamps[i - 1]!
    if (d > 0) deltas.push(d)
  }
  const durationMs = stamps[stamps.length - 1]! - stamps[0]!
  const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length
  const sorted = [...deltas].sort((a, b) => a - b)
  return {
    frameCount: stamps.length,
    avgFps: Math.round((1000 / avgDelta) * 100) / 100,
    minFps: Math.round((1000 / Math.max(...deltas)) * 100) / 100,
    p95FrameMs: Math.round(sorted[Math.floor(sorted.length * 0.95)]! * 100) / 100,
    durationMs: Math.round(durationMs * 100) / 100,
  }
}

function collectFrames(ms: number): Promise<number[]> {
  return new Promise((resolve) => {
    const stamps: number[] = []
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      stamps.push(t)
      if (performance.now() - start >= ms) {
        cancelAnimationFrame(raf)
        resolve(stamps)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
  })
}

function setScrubValue(value: number) {
  const input = document.querySelector(
    '[data-testid="rrg-playback-scrubber"]',
  ) as HTMLInputElement | null
  if (!input) return
  input.value = String(value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

export async function runDemoPerfSample(interaction: 'scrub' | 'play'): Promise<DemoPerfSample> {
  const scrubber = document.querySelector(
    '[data-testid="rrg-playback-scrubber"]',
  ) as HTMLInputElement | null
  const toggle = document.querySelector(
    '[data-testid="rrg-playback-toggle"]',
  ) as HTMLButtonElement | null

  let stamps: number[] = []

  if (interaction === 'scrub' && scrubber) {
    const max = Number(scrubber.max) || 0
    const steps = Math.min(40, max + 1)
    const collect = collectFrames(steps * 20 + 200)
    for (let i = 0; i < steps; i++) {
      setScrubValue(Math.round((i / Math.max(steps - 1, 1)) * max))
      await new Promise((r) => setTimeout(r, 16))
    }
    scrubber.dispatchEvent(new Event('change', { bubbles: true }))
    stamps = await collect
  } else if (interaction === 'play' && toggle) {
    const collect = collectFrames(2000)
    toggle.click()
    stamps = await collect
    const root = document.querySelector('[data-testid="rrg-playback"]')
    if (root?.getAttribute('data-playing') === 'true') toggle.click()
  } else {
    stamps = await collectFrames(500)
  }

  return { interaction, ...metricsFromStamps(stamps), at: new Date().toISOString() }
}
