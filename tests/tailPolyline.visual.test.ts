import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgChart from '../src/components/RrgChart.vue'
import { noisyTailMock } from '../demo/adversarialMocks'
import { datesForSeries } from '../demo/scenarios'

function tailPoints(wrapper: ReturnType<typeof mount>, ticker: string): string {
  return wrapper.get(`[data-testid="rrg-tail-${ticker}"] .rrg-tail-segment`).attributes('points')!
}

describe('tail polyline visual regression (geometry snapshots)', () => {
  it('sharp turn: polyline connects every vertex in order', () => {
    const series = [
      {
        ticker: 'TURN',
        label: 'TURN',
        color: '#4e79a7',
        points: [
          { date: '2024-01-01', x: 100, y: 100, quadrant: 'leading' as const },
          { date: '2024-02-01', x: 110, y: 100, quadrant: 'leading' as const },
          { date: '2024-03-01', x: 110, y: 90, quadrant: 'leading' as const },
          { date: '2024-04-01', x: 100, y: 90, quadrant: 'leading' as const },
        ],
      },
    ]
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-04-01',
        tailLength: 10,
        width: 640,
        height: 480,
        viewportMode: 'center',
      },
    })

    const points = tailPoints(wrapper, 'TURN').split(' ')
    expect(points).toHaveLength(4)
    expect(points[0]).not.toBe(points[1])
    expect(points[1]).not.toBe(points[2])
    expect(points[2]).not.toBe(points[3])
  })

  it('nearly reversing tail preserves vertex order', () => {
    const series = [
      {
        ticker: 'REV',
        label: 'REV',
        color: '#e15759',
        points: [
          { date: '2024-01-01', x: 100, y: 100, quadrant: 'leading' as const },
          { date: '2024-02-01', x: 101, y: 100.2, quadrant: 'leading' as const },
          { date: '2024-03-01', x: 100.2, y: 100.1, quadrant: 'leading' as const },
          { date: '2024-04-01', x: 100.1, y: 100.05, quadrant: 'leading' as const },
        ],
      },
    ]
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-04-01',
        tailLength: 10,
        width: 640,
        height: 480,
        viewportMode: 'center',
      },
    })

    const coords = tailPoints(wrapper, 'REV')
      .split(' ')
      .map((pair) => pair.split(',').map(Number))
    expect(coords).toHaveLength(4)
    expect(coords[0]![0]).toBeLessThan(coords[1]![0])
    expect(coords[2]![0]).toBeLessThan(coords[1]![0])
  })

  it('single-segment tail renders one visual polyline with two points', () => {
    const series = [
      {
        ticker: 'ONE',
        label: 'ONE',
        color: '#59a14f',
        points: [
          { date: '2024-01-01', x: 100, y: 100, quadrant: 'leading' as const },
          { date: '2024-02-01', x: 101, y: 101, quadrant: 'leading' as const },
        ],
      },
    ]
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-02-01',
        tailLength: 10,
        width: 640,
        height: 480,
        viewportMode: 'center',
      },
    })

    expect(wrapper.get('[data-testid="rrg-tail-ONE"] .rrg-tail-segment').element.tagName).toBe(
      'polyline',
    )
    expect(tailPoints(wrapper, 'ONE').split(' ')).toHaveLength(2)
  })

  it('long noisy adversarial tail matches a stable geometry snapshot', () => {
    const selectedDate = datesForSeries(noisyTailMock).at(-1)!
    const wrapper = mount(RrgChart, {
      props: {
        series: noisyTailMock,
        selectedDate,
        tailLength: 20,
        width: 640,
        height: 480,
        viewportMode: 'fit',
      },
    })

    expect(tailPoints(wrapper, 'ZZY')).toMatchSnapshot()
  })
})
