import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgChart from '../src/components/RrgChart.vue'

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
]

describe('RrgChart tails', () => {
  it('renders tail groups with consolidated polylines behind points', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        tailLength: 10,
        width: 640,
        height: 480,
      },
    })

    expect(wrapper.get('[data-testid="rrg-tail-XLK"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="rrg-tail-XLK"]').findAll('.rrg-tail-segment').length).toBe(1)
    expect(wrapper.get('[data-testid="rrg-tail-XLK"]').findAll('.rrg-tail-hit').length).toBe(1)
    expect(wrapper.get('[data-testid="rrg-point-XLK"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="rrg-chart"]').attributes('data-show-tail-fade')).toBe(
      'false',
    )
  })

  it('polyline points connect the same coordinates as segment geometry', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        tailLength: 10,
        width: 640,
        height: 480,
      },
    })

    const polyline = wrapper.get('[data-testid="rrg-tail-XLK"] .rrg-tail-segment')
    expect(polyline.element.tagName.toLowerCase()).toBe('polyline')
    expect(polyline.attributes('points')).toMatch(/[\d.]+,[\d.]+/)
    expect(polyline.attributes('points')!.split(' ').length).toBe(3)
  })

  it('applies segment opacity gradient when showTailFade is true', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        showTailFade: true,
        width: 640,
        height: 480,
      },
    })

    const lines = wrapper.get('[data-testid="rrg-tail-XLK"]').findAll('.rrg-tail-segment')
    const hits = wrapper.get('[data-testid="rrg-tail-XLK"]').findAll('[data-testid="rrg-tail-hit"]')
    expect(lines).toHaveLength(2)
    expect(hits).toHaveLength(1)
    const o0 = Number(lines[0].attributes('stroke-opacity'))
    const o1 = Number(lines[1].attributes('stroke-opacity'))
    expect(o0).toBeLessThan(o1)
    expect(wrapper.get('[data-testid="rrg-chart"]').attributes('data-show-tail-fade')).toBe(
      'true',
    )
  })

  it('reuses the same polyline DOM nodes across selectedDate changes (stable keys)', async () => {
    const history = Array.from({ length: 20 }, (_, i) => ({
      date: `2024-01-${String(i + 1).padStart(2, '0')}`,
      x: 100 + i * 0.2,
      y: 100 + (i % 3) * 0.1,
      quadrant: 'leading' as const,
    }))
    const wrapper = mount(RrgChart, {
      props: {
        series: [{ ticker: 'XLK', label: 'XLK', color: '#4e79a7', points: history }],
        selectedDate: history[14].date,
        tailLength: 10,
        width: 640,
        height: 480,
      },
    })

    const segs = () => wrapper.get('[data-testid="rrg-tail-XLK"]').findAll('.rrg-tail-segment')
    const hits = () =>
      wrapper.get('[data-testid="rrg-tail-XLK"]').findAll('[data-testid="rrg-tail-hit"]')
    expect(segs()).toHaveLength(1)
    expect(hits()).toHaveLength(1)

    const segEl = segs()[0].element
    const hitEl = hits()[0].element
    const pointsBefore = segEl.getAttribute('points')

    await wrapper.setProps({ selectedDate: history[18].date })

    expect(segs()[0].element).toBe(segEl)
    expect(hits()[0].element).toBe(hitEl)
    expect(segEl.getAttribute('points')).not.toEqual(pointsBefore)
  })
})
