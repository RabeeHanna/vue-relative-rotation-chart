import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgChart from '../src/components/RrgChart.vue'
import { longPlayback100, longPlayback500 } from '../src/scenarios'

const series = [
  {
    ticker: 'XLK',
    label: 'XLK',
    name: 'Technology',
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
    points: [
      { date: '2024-01-01', x: 96, y: 97, quadrant: 'lagging' as const },
      { date: '2024-02-01', x: 96.5, y: 97.5, quadrant: 'lagging' as const },
      { date: '2024-03-01', x: 97, y: 98, quadrant: 'lagging' as const },
    ],
  },
]

describe('RrgChart tail hover', () => {
  it('sets hover from a tail hit segment with current-frame pointHover payload', async () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        tailLength: 10,
        width: 640,
        height: 480,
      },
    })

    const hit = wrapper.get('[data-testid="rrg-tail-XLK"] [data-testid="rrg-tail-hit"]')
    await hit.trigger('pointerenter')

    expect(wrapper.emitted('pointHover')?.[0]?.[0]).toMatchObject({
      ticker: 'XLK',
      name: 'Technology',
      x: 104,
      y: 103,
      date: '2024-03-01',
    })
    expect(wrapper.get('[data-testid="rrg-chart"]').attributes('data-hovered-ticker')).toBe(
      'XLK',
    )
    expect(wrapper.get('[data-testid="rrg-tooltip"]').exists()).toBe(true)
  })

  it('clears hover when leaving a tail into empty space', async () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
      },
    })

    const hit = wrapper.get('[data-testid="rrg-tail-XLK"] [data-testid="rrg-tail-hit"]')
    await hit.trigger('pointerenter')
    await hit.trigger('pointerleave', { relatedTarget: document.body })

    expect(wrapper.emitted('pointLeave')).toBeTruthy()
    expect(wrapper.find('[data-testid="rrg-tooltip"]').exists()).toBe(false)
  })

  it('does not clear hover when leaving a tail toward a point hit (point-wins handoff)', async () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
      },
    })

    const pointHit = wrapper.get('[data-testid="rrg-point-XLK"] .rrg-point-hit').element
    const hit = wrapper.get('[data-testid="rrg-tail-XLK"] [data-testid="rrg-tail-hit"]')
    await hit.trigger('pointerenter')
    await hit.trigger('pointerleave', { relatedTarget: pointHit })

    expect(wrapper.emitted('pointLeave')).toBeFalsy()
    expect(wrapper.get('[data-testid="rrg-chart"]').attributes('data-hovered-ticker')).toBe(
      'XLK',
    )
  })

  it('keeps point hit circles above tails in DOM order (point-wins)', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
      },
    })

    const tails = wrapper.get('[data-testid="rrg-tails"]').element
    const points = wrapper.get('[data-testid="rrg-points"]').element
    expect(
      tails.compareDocumentPosition(points) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('mounts long-playback fixtures with tail hits without throw', () => {
    for (const fixture of [longPlayback100, longPlayback500]) {
      const date = fixture[0].points.at(-1)!.date
      const wrapper = mount(RrgChart, {
        props: {
          series: fixture,
          selectedDate: date,
          tailLength: 20,
          width: 640,
          height: 480,
        },
      })
      expect(wrapper.get('[data-testid="rrg-tails"]').exists()).toBe(true)
      expect(wrapper.findAll('[data-testid="rrg-tail-hit"]').length).toBeGreaterThan(50)
      wrapper.unmount()
    }
  })
})
