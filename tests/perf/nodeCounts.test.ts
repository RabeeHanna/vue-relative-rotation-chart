import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgChart from '../../src/components/RrgChart.vue'
import { longPlayback100, longPlayback200, mockSeries } from '../../src/scenarios'
import { expectedTailLineCounts } from './expectedTailNodes'

function countTailNodes(wrapper: ReturnType<typeof mount>) {
  const root = wrapper.get('[data-testid="rrg-tails"]')
  return {
    hits: root.findAll('[data-testid="rrg-tail-hit"]').length,
    segments: root.findAll('.rrg-tail-segment').length,
  }
}

describe('perf node-count invariants (hard gate)', () => {
  it('P0-shaped default: capped tailLength yields expected hit+segment counts', () => {
    const series = mockSeries
    const selectedDate = series[0].points.at(-1)!.date
    const tailLength = 10
    const expected = expectedTailLineCounts({
      tickerCount: series.length,
      tailLength,
      pointsThroughSelected: series[0].points.length,
    })

    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate,
        tailLength,
        labelMode: 'hover',
        width: 640,
        height: 480,
      },
    })

    const nodes = countTailNodes(wrapper)
    expect(nodes.hits).toBe(expected.hits)
    expect(nodes.segments).toBe(expected.segments)
    expect(nodes.hits + nodes.segments).toBe(expected.totalLines)
  })

  it('P2 capped longPlayback200: line count flat in history length (L=10 → 72+72)', () => {
    const series = longPlayback200
    const selectedDate = series[0].points.at(-1)!.date
    const expected = expectedTailLineCounts({
      tickerCount: 8,
      tailLength: 10,
      pointsThroughSelected: 200,
    })
    expect(expected).toEqual({ segments: 72, hits: 72, totalLines: 144 })

    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate,
        tailLength: 10,
        labelMode: 'hover',
        width: 640,
        height: 480,
      },
    })

    const nodes = countTailNodes(wrapper)
    expect(nodes.hits).toBe(72)
    expect(nodes.segments).toBe(72)
  })

  it('full-history LP100: documents ~1584 lines (not a product FPS gate)', () => {
    const series = longPlayback100
    const selectedDate = series[0].points.at(-1)!.date
    const expected = expectedTailLineCounts({
      tickerCount: 8,
      tailLength: 100,
      pointsThroughSelected: 100,
    })
    expect(expected.totalLines).toBe(8 * 99 * 2)

    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate,
        tailLength: 100,
        labelMode: 'hover',
        width: 640,
        height: 480,
      },
    })

    const nodes = countTailNodes(wrapper)
    expect(nodes.hits).toBe(expected.hits)
    expect(nodes.segments).toBe(expected.segments)
  })

  it('capped scrub: node counts stay constant across sliding selectedDate', async () => {
    const series = longPlayback200
    const dates = series[0].points.map((p) => p.date)
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: dates[50],
        tailLength: 10,
        labelMode: 'hover',
        width: 640,
        height: 480,
      },
    })

    const before = countTailNodes(wrapper)
    expect(before.hits).toBe(72)

    for (const date of [dates[80], dates[120], dates[199]]) {
      await wrapper.setProps({ selectedDate: date })
      const after = countTailNodes(wrapper)
      expect(after.hits).toBe(before.hits)
      expect(after.segments).toBe(before.segments)
    }
  })
})
