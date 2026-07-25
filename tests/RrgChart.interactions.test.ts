import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgChart from '../src/components/RrgChart.vue'

const series = [
  {
    ticker: 'XLK',
    label: 'XLK',
    name: 'Technology',
    color: '#4e79a7',
    points: [
      { date: '2024-01-01', x: 102, y: 101, quadrant: 'leading' as const },
      { date: '2024-03-01', x: 104, y: 103, quadrant: 'leading' as const },
    ],
  },
  {
    ticker: 'XLF',
    label: 'XLF',
    color: '#e15759',
    points: [
      { date: '2024-01-01', x: 96, y: 97, quadrant: 'lagging' as const },
      { date: '2024-03-01', x: 97, y: 98, quadrant: 'lagging' as const },
    ],
  },
]

describe('RrgChart interactions', () => {
  it('emits pointHover with date payload on pointer enter', async () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
      },
    })

    await wrapper.get('[data-testid="rrg-point-XLK"] .rrg-point-hit').trigger('pointerenter')

    expect(wrapper.emitted('pointHover')?.[0]?.[0]).toMatchObject({
      ticker: 'XLK',
      name: 'Technology',
      x: 104,
      y: 103,
      quadrant: 'leading',
      date: '2024-03-01',
    })
    expect(wrapper.get('[data-testid="rrg-tooltip"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="rrg-chart"]').attributes('data-hovered-ticker')).toBe(
      'XLK',
    )
  })

  it('emits pointLeave when pointer leaves the point', async () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
      },
    })

    await wrapper.get('[data-testid="rrg-point-XLK"] .rrg-point-hit').trigger('pointerenter')
    await wrapper.get('[data-testid="rrg-point-XLK"] .rrg-point-hit').trigger('pointerleave')

    expect(wrapper.emitted('pointLeave')).toBeTruthy()
    expect(wrapper.find('[data-testid="rrg-tooltip"]').exists()).toBe(false)
  })

  it('emits pointClick with correct payload', async () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
      },
    })

    await wrapper.get('[data-testid="rrg-point-XLF"] .rrg-point-hit').trigger('click')

    expect(wrapper.emitted('pointClick')?.[0]?.[0]).toMatchObject({
      ticker: 'XLF',
      x: 97,
      y: 98,
      quadrant: 'lagging',
      date: '2024-03-01',
    })
  })

  it('highlightedTicker changes effective hover without pointer interaction', async () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
        highlightedTicker: 'XLF',
      },
    })

    expect(wrapper.get('[data-testid="rrg-chart"]').attributes('data-hovered-ticker')).toBe(
      'XLF',
    )
    expect(wrapper.get('[data-testid="rrg-point-XLK"]').attributes('opacity')).toBe('0.25')
    expect(wrapper.get('[data-testid="rrg-point-XLF"]').attributes('opacity')).toBe('1')
    expect(wrapper.find('[data-testid="rrg-tooltip"]').exists()).toBe(false)
  })

  it('fades unrelated tails while keeping hovered tail full opacity', async () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
      },
    })

    await wrapper.get('[data-testid="rrg-point-XLK"] .rrg-point-hit').trigger('pointerenter')

    const xlkSeg = wrapper.get('[data-testid="rrg-tail-XLK"]').get('.rrg-tail-segment')
    const xlfSeg = wrapper.get('[data-testid="rrg-tail-XLF"]').get('.rrg-tail-segment')
    expect(Number(xlkSeg.attributes('stroke-opacity'))).toBeGreaterThan(
      Number(xlfSeg.attributes('stroke-opacity')),
    )
  })
})
