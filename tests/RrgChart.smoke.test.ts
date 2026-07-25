import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgChart from '../src/components/RrgChart.vue'

const series = [
  {
    ticker: 'XLK',
    label: 'XLK',
    points: [{ date: '2024-03-01', x: 104, y: 101, quadrant: 'leading' as const }],
  },
]

describe('RrgChart smoke', () => {
  it('mounts without errors and exposes rrg-chart test id', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
      },
    })
    expect(wrapper.get('[data-testid="rrg-chart"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="rrg-svg-root"]').exists()).toBe(true)
  })

  it('applies dark theme class for CSS variable overrides', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
      },
      attrs: { class: 'dark' },
    })
    expect(wrapper.get('[data-testid="rrg-chart"]').classes()).toContain('dark')
    expect(wrapper.get('.rrg-bg').attributes('fill')).toContain('--rrg-bg')
  })
})
