import { describe, expect, it } from 'vitest'
import { performance } from 'node:perf_hooks'
import { computed } from 'vue'
import { scaleLinear } from 'd3-scale'
import { useRrgTailSlices } from '../src/composables/useRrgTailSlices'
import { buildSeriesIndex } from '../src/utils/seriesIndex'
import type { RrgRenderSeries } from '../src/types/rrg'
import type { RrgScale } from '../src/composables/useRrgScales'

function makeStressSeries(tickerCount: number, pointsPerTicker: number): RrgRenderSeries[] {
  return Array.from({ length: tickerCount }, (_, t) => ({
    ticker: `T${t}`,
    label: `T${t}`,
    points: Array.from({ length: pointsPerTicker }, (_, i) => ({
      date: `2024-01-${String(i + 1).padStart(2, '0')}`,
      x: 100 + (t % 10) + i * 0.05,
      y: 100 + (t % 7) * 0.1 - i * 0.03,
      quadrant: 'leading' as const,
    })),
  }))
}

describe('tail performance smoke', () => {
  it('computes 50×30 tails in well under a frame budget sample', () => {
    const series = makeStressSeries(50, 30)
    const selectedDate = series[0].points[29].date
    const xScale = computed(
      () => scaleLinear().domain([90, 120]).range([0, 500]) as RrgScale,
    )
    const yScale = computed(
      () => scaleLinear().domain([90, 120]).range([500, 0]) as RrgScale,
    )

    const seriesIndex = computed(() => buildSeriesIndex(series))
    const start = performance.now()
    for (let i = 0; i < 30; i++) {
      const { tailData } = useRrgTailSlices(
        seriesIndex,
        computed(() => selectedDate),
        computed(() => 30),
        xScale,
        yScale,
      )
      expect(tailData.value).toHaveLength(50)
      expect(tailData.value[0].segments.length).toBeGreaterThan(0)
    }
    const avgMs = (performance.now() - start) / 30
    // Generous CPU budget for pure computation (render FPS gated later in browser)
    expect(avgMs).toBeLessThan(16)
  })
})
