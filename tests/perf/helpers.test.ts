import { describe, expect, it } from 'vitest'
import { expectedTailNodeCounts, PERF_TARGET_FPS, segmentsPerTicker } from './expectedTailNodes'
import { computeFpsMetrics } from './fpsMetrics'
import { profileUrl, stressEnv } from './perfHarness'

describe('perf helpers', () => {
  it('segmentsPerTicker clamps window', () => {
    expect(segmentsPerTicker(10, 200)).toBe(9)
    expect(segmentsPerTicker(10, 5)).toBe(4)
    expect(segmentsPerTicker(10, 1)).toBe(0)
  })

  it('expectedTailNodeCounts: default mode uses 2T consolidated polylines', () => {
    expect(
      expectedTailNodeCounts({ tickerCount: 8, tailLength: 10, pointsThroughSelected: 200 }),
    ).toEqual({
      visualNodes: 8,
      hitNodes: 8,
      totalNodes: 16,
    })
  })

  it('expectedTailNodeCounts: no history yields zero nodes', () => {
    expect(
      expectedTailNodeCounts({ tickerCount: 8, tailLength: 10, pointsThroughSelected: 1 }),
    ).toEqual({
      visualNodes: 0,
      hitNodes: 0,
      totalNodes: 0,
    })
  })

  it('expectedTailNodeCounts: fade mode uses per-segment visuals plus one hit polyline per ticker', () => {
    expect(
      expectedTailNodeCounts({
        tickerCount: 8,
        tailLength: 10,
        pointsThroughSelected: 200,
        showTailFade: true,
      }),
    ).toEqual({
      visualNodes: 72,
      hitNodes: 8,
      totalNodes: 80,
    })
  })

  it('computeFpsMetrics averages frame deltas', () => {
    const stamps = Array.from({ length: 10 }, (_, i) => i * (1000 / 60))
    const m = computeFpsMetrics(stamps)
    expect(m.avgFps).toBeGreaterThan(55)
    expect(PERF_TARGET_FPS).toBe(55)
  })

  it('stressEnv defaults and profileUrl encode generator ceiling', () => {
    const keys = [
      'PERF_TICKERS',
      'PERF_POINTS',
      'PERF_FULL_HISTORY',
      'PERF_PLAY_MS',
      'PERF_SCRUB_STEPS',
      'PERF_SEED',
      'PERF_TAIL',
    ] as const
    const saved = Object.fromEntries(keys.map((k) => [k, process.env[k]]))
    for (const k of keys) delete process.env[k]
    try {
      const s = stressEnv()
      expect(s.tickers).toBe(100)
      expect(s.points).toBe(500)
      expect(s.fullHistory).toBe(true)
      expect(s.playMs).toBe(120_000)
      const url = profileUrl('stress-ceiling')
      expect(url).toContain('source=generated')
      expect(url).toContain('genTickers=100')
      expect(url).toContain('genPoints=500')
      expect(url).toContain('fullHistoryTail=true')
    } finally {
      for (const k of keys) {
        if (saved[k] === undefined) delete process.env[k]
        else process.env[k] = saved[k]
      }
    }
  })
})
