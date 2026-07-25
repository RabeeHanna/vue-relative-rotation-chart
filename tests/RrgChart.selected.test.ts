import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgChart from '../src/components/RrgChart.vue'

const series = [
  {
    ticker: 'XLK',
    label: 'XLK',
    points: [
      { date: '2024-01-01', x: 104, y: 103, quadrant: 'leading' as const },
      { date: '2024-03-01', x: 105, y: 102, quadrant: 'leading' as const },
    ],
  },
]

describe('selectedTicker and radii', () => {
  it('renders a selection ring for selectedTicker', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        selectedTicker: 'XLK',
        pointRadius: 6,
        hitRadius: 14,
      },
    })

    const group = wrapper.get('[data-testid="rrg-point-XLK"]')
    expect(group.attributes('data-selected')).toBe('true')
    expect(group.find('.rrg-point-selected').exists()).toBe(true)
    expect(group.find('.rrg-point').attributes('r')).toBe('6')
    expect(group.find('.rrg-point-hit').attributes('r')).toBe('14')
  })
})
