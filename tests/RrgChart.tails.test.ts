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
  it('renders tail groups with segments behind points', () => {
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
    expect(wrapper.get('[data-testid="rrg-tail-XLK"]').findAll('line').length).toBe(2)
    expect(wrapper.get('[data-testid="rrg-point-XLK"]').exists()).toBe(true)
  })
})
