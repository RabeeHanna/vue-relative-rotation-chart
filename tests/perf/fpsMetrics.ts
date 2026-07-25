export type FpsMetrics = {
  frameCount: number
  avgFps: number
  minFps: number
  p95FrameMs: number
  durationMs: number
}

/** Derive FPS from rAF timestamps (performance.now or DOMHighResTimeStamp). */
export function computeFpsMetrics(timestamps: number[]): FpsMetrics {
  if (timestamps.length < 2) {
    return { frameCount: timestamps.length, avgFps: 0, minFps: 0, p95FrameMs: 0, durationMs: 0 }
  }
  const deltas: number[] = []
  for (let i = 1; i < timestamps.length; i++) {
    const d = timestamps[i]! - timestamps[i - 1]!
    if (d > 0) deltas.push(d)
  }
  if (deltas.length === 0) {
    return { frameCount: timestamps.length, avgFps: 0, minFps: 0, p95FrameMs: 0, durationMs: 0 }
  }
  const durationMs = timestamps[timestamps.length - 1]! - timestamps[0]!
  const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length
  const avgFps = 1000 / avgDelta
  const maxDelta = Math.max(...deltas)
  const minFps = 1000 / maxDelta
  const sorted = [...deltas].sort((a, b) => a - b)
  const p95FrameMs = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))]!
  return {
    frameCount: timestamps.length,
    avgFps: round2(avgFps),
    minFps: round2(minFps),
    p95FrameMs: round2(p95FrameMs),
    durationMs: round2(durationMs),
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
