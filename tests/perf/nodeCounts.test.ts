import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgChart from '../../src/components/RrgChart.vue'
import { longPlayback100, longPlayback200, mockSeries } from '../../src/scenarios'
import { expectedTailNodeCounts } from './expectedTailNodes'

function countTailNodes(wrapper: ReturnType<typeof mount>) {
  const root = wrapper.get('[data-testid="rrg-tails"]')
  return {
    hitNodes: root.findAll('[data-testid="rrg-tail-hit"]').length,
    visualNodes: root.findAll('.rrg-tail-segment').length,
  }
}

describe('perf node-count invariants (hard gate)', () => {
  it('P0-shaped default: consolidated polylines yield 2T tail nodes', () => {
    const series = mockSeries
    const selectedDate = series[0].points.at(-1)!.date
    const tailLength = 10
    const expected = expectedTailNodeCounts({
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
    expect(nodes.hitNodes).toBe(expected.hitNodes)
    expect(nodes.visualNodes).toBe(expected.visualNodes)
    expect(nodes.hitNodes + nodes.visualNodes).toBe(expected.totalNodes)
    expect(expected.totalNodes).toBe(series.length * 2)
  })

  it('P2 capped longPlayback200: node count is 2T regardless of history length', () => {
    const series = longPlayback200
    const selectedDate = series[0].points.at(-1)!.date
    const expected = expectedTailNodeCounts({
      tickerCount: 8,
      tailLength: 10,
      pointsThroughSelected: 200,
    })
    expect(expected).toEqual({ visualNodes: 8, hitNodes: 8, totalNodes: 16 })

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
    expect(nodes.hitNodes).toBe(8)
    expect(nodes.visualNodes).toBe(8)
  })

  it('full-history LP100: consolidated default mode stays at 2T (not 2T(P−1))', () => {
    const series = longPlayback100
    const selectedDate = series[0].points.at(-1)!.date
    const expected = expectedTailNodeCounts({
      tickerCount: 8,
      tailLength: 100,
      pointsThroughSelected: 100,
    })
    expect(expected.totalNodes).toBe(16)

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
    expect(nodes.hitNodes).toBe(expected.hitNodes)
    expect(nodes.visualNodes).toBe(expected.visualNodes)
  })

  it('fade mode uses one hit polyline plus per-segment visual lines', () => {
    const series = longPlayback200
    const selectedDate = series[0].points.at(-1)!.date
    const expected = expectedTailNodeCounts({
      tickerCount: 8,
      tailLength: 10,
      pointsThroughSelected: 200,
      showTailFade: true,
    })
    expect(expected).toEqual({ visualNodes: 72, hitNodes: 8, totalNodes: 80 })

    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate,
        tailLength: 10,
        showTailFade: true,
        labelMode: 'hover',
        width: 640,
        height: 480,
      },
    })

    const nodes = countTailNodes(wrapper)
    expect(nodes.hitNodes).toBe(8)
    expect(nodes.visualNodes).toBe(72)
  })

  it('first available date renders no tail nodes', () => {
    const series = mockSeries
    const firstDate = series[0].points[0].date
    const expected = expectedTailNodeCounts({
      tickerCount: series.length,
      tailLength: 10,
      pointsThroughSelected: 1,
    })
    expect(expected.totalNodes).toBe(0)

    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: firstDate,
        tailLength: 10,
        width: 640,
        height: 480,
      },
    })

    expect(countTailNodes(wrapper)).toEqual({ hitNodes: 0, visualNodes: 0 })
  })

  it('tailLength 1 renders no tail nodes', () => {
    const series = mockSeries
    const selectedDate = series[0].points.at(-1)!.date
    const expected = expectedTailNodeCounts({
      tickerCount: series.length,
      tailLength: 1,
      pointsThroughSelected: series[0].points.length,
    })
    expect(expected.totalNodes).toBe(0)

    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate,
        tailLength: 1,
        width: 640,
        height: 480,
      },
    })

    expect(countTailNodes(wrapper)).toEqual({ hitNodes: 0, visualNodes: 0 })
  })

  it('empty series renders no tail nodes', () => {
    const expected = expectedTailNodeCounts({
      tickerCount: 0,
      tailLength: 10,
      pointsThroughSelected: 0,
      activeTickerCount: 0,
    })
    expect(expected.totalNodes).toBe(0)

    const wrapper = mount(RrgChart, {
      props: {
        series: [],
        selectedDate: '2024-03-01',
        tailLength: 10,
        width: 640,
        height: 480,
      },
    })

    expect(wrapper.find('[data-testid="rrg-tails"]').exists()).toBe(false)
    expect(expected.totalNodes).toBe(0)
  })

  it('mixed series only counts tickers with a point at selectedDate', () => {
    const series = [
      {
        ticker: 'XLK',
        label: 'XLK',
        color: '#4e79a7',
        points: [
          { date: '2024-01-01', x: 102, y: 101, quadrant: 'leading' as const },
          { date: '2024-02-01', x: 103, y: 102, quadrant: 'leading' as const },
          { date: '2024-03-01', x: 104, y: 103, quadrant: 'leading' as const },
        ],
      },
      {
        ticker: 'XLF',
        label: 'XLF',
        color: '#e15759',
        points: [{ date: '2024-01-01', x: 96, y: 97, quadrant: 'lagging' as const }],
      },
    ]
    const expected = expectedTailNodeCounts({
      tickerCount: 2,
      activeTickerCount: 1,
      tailLength: 10,
      pointsThroughSelected: 3,
    })
    expect(expected).toEqual({ visualNodes: 1, hitNodes: 1, totalNodes: 2 })

    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        tailLength: 10,
        width: 640,
        height: 480,
      },
    })

    expect(countTailNodes(wrapper)).toEqual({ hitNodes: 1, visualNodes: 1 })
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
    expect(before.hitNodes).toBe(8)

    for (const date of [dates[80], dates[120], dates[199]]) {
      await wrapper.setProps({ selectedDate: date })
      const after = countTailNodes(wrapper)
      expect(after.hitNodes).toBe(before.hitNodes)
      expect(after.visualNodes).toBe(before.visualNodes)
    }
  })
})
