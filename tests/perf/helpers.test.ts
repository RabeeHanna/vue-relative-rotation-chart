import { describe, expect, it } from 'vitest'
import { expectedTailLineCounts, PERF_TARGET_FPS, segmentsPerTicker } from './expectedTailNodes'
import { computeFpsMetrics } from './fpsMetrics'

describe('perf helpers', () => {
  it('segmentsPerTicker clamps window', () => {
    expect(segmentsPerTicker(10, 200)).toBe(9)
    expect(segmentsPerTicker(10, 5)).toBe(4)
    expect(segmentsPerTicker(10, 1)).toBe(0)
  })

  it('expectedTailLineCounts doubles for hit+visible', () => {
    expect(expectedTailLineCounts({ tickerCount: 8, tailLength: 10, pointsThroughSelected: 200 })).toEqual({
      segments: 72,
      hits: 72,
      totalLines: 144,
    })
  })

  it('computeFpsMetrics averages frame deltas', () => {
    // 10 frames at 16.67ms ≈ 60fps
    const stamps = Array.from({ length: 10 }, (_, i) => i * (1000 / 60))
    const m = computeFpsMetrics(stamps)
    expect(m.avgFps).toBeGreaterThan(55)
    expect(PERF_TARGET_FPS).toBe(55)
  })
})
