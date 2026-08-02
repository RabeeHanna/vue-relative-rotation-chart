import { describe, expect, it } from 'vitest'
import { performance } from 'node:perf_hooks'
import { computed } from 'vue'
import { mount } from '@vue/test-utils'
import { scaleLinear } from 'd3-scale'
import RrgChart from '../src/components/RrgChart.vue'
import { useRrgTailSlices } from '../src/composables/useRrgTailSlices'
import { buildSeriesIndex } from '../src/utils/seriesIndex'
import type { RrgScale } from '../src/composables/useRrgScales'
import {
  LONG_PLAYBACK_LENGTHS,
  makeLongPlaybackSeries,
} from '../demo/longPlayback'
import { datesForSeries, scenarioById } from '../demo/scenarios'

/**
 * Long-playback ceiling probe.
 * Soft budgets flag future optimization targets; they should not flake on CI.
 * Hotspots to watch later: tail segment rebuilds, label layout, playback date list.
 */
describe('long playback stress', () => {
  it.each(LONG_PLAYBACK_LENGTHS)(
    'fixture %i points/ticker mounts and exposes a long date timeline',
    (points) => {
      const id = `longPlayback${points}` as const
      const series = scenarioById[id].series
      expect(series).toHaveLength(8)
      expect(series[0].points).toHaveLength(points)

      const dates = datesForSeries(series)
      expect(dates).toHaveLength(points)

      const wrapper = mount(RrgChart, {
        props: {
          series,
          selectedDate: dates[dates.length - 1],
          tailLength: 10,
          labelMode: 'hover',
          width: 640,
          height: 480,
        },
      })

      expect(wrapper.get('[data-testid="rrg-chart"]').exists()).toBe(true)
      expect(wrapper.get('[data-testid="rrg-point-XLK"]').exists()).toBe(true)
      expect(wrapper.get('[data-testid="rrg-tail-XLK"]').findAll('line').length).toBeGreaterThan(0)
    },
  )

  it('profiles tail recompute cost across 50/100/200/500 point lengths', () => {
    const xScale = computed(
      () => scaleLinear().domain([90, 120]).range([0, 500]) as RrgScale,
    )
    const yScale = computed(
      () => scaleLinear().domain([90, 120]).range([500, 0]) as RrgScale,
    )

    const report: Array<{ points: number; avgMs: number; segments: number }> = []

    for (const points of LONG_PLAYBACK_LENGTHS) {
      const series = makeLongPlaybackSeries(points)
      const selectedDate = series[0].points[points - 1].date
      const iterations = points >= 200 ? 10 : 20

      const seriesIndex = computed(() => buildSeriesIndex(series))
      const start = performance.now()
      let segments = 0
      for (let i = 0; i < iterations; i++) {
        const { tailData } = useRrgTailSlices(
          seriesIndex,
          computed(() => selectedDate),
          computed(() => 10),
          xScale,
          yScale,
        )
        segments = tailData.value.reduce((n, t) => n + t.segments.length, 0)
        expect(tailData.value).toHaveLength(8)
      }
      const avgMs = (performance.now() - start) / iterations
      report.push({ points, avgMs, segments })

      // Soft ceiling: pure compute should stay interactive; 500 is diagnostic.
      const budget = points <= 100 ? 16 : points <= 200 ? 40 : 120
      expect(avgMs).toBeLessThan(budget)
    }

    // Visible in vitest output for future optimization planning.
    // eslint-disable-next-line no-console
    console.table(report)
  })
})
