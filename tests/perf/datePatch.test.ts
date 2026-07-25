import { describe, expect, it } from 'vitest'
import { performance } from 'node:perf_hooks'
import { mount } from '@vue/test-utils'
import RrgChart from '../../src/components/RrgChart.vue'
import { longPlayback200, mockSeries } from '../../src/scenarios'

/**
 * JSDOM / happy-dom patch timings — NOT browser FPS.
 * Soft ceilings catch gross remount regressions; do not treat as paint budgets.
 */
describe('perf date-patch timings (soft, non-FPS)', () => {
  it('P0: walking dates stays under a soft per-step ceiling', async () => {
    const series = mockSeries
    const dates = series[0].points.map((p) => p.date)
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: dates[0],
        tailLength: 10,
        labelMode: 'hover',
        width: 640,
        height: 480,
      },
    })

    const start = performance.now()
    for (const date of dates) {
      await wrapper.setProps({ selectedDate: date })
    }
    const avgMs = (performance.now() - start) / dates.length
    // Soft: happy-dom patch; generous for CI noise.
    expect(avgMs).toBeLessThan(40)
  })

  it('P2 capped LP200: sample of date steps stays under soft ceiling', async () => {
    const series = longPlayback200
    const dates = series[0].points.map((p) => p.date)
    const sample = dates.filter((_, i) => i % 10 === 0)
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: sample[0],
        tailLength: 10,
        labelMode: 'hover',
        width: 640,
        height: 480,
      },
    })

    const start = performance.now()
    for (const date of sample) {
      await wrapper.setProps({ selectedDate: date })
    }
    const avgMs = (performance.now() - start) / sample.length
    expect(avgMs).toBeLessThan(50)
  })
})
