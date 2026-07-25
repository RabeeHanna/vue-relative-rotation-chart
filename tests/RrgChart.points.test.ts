import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgChart from '../src/components/RrgChart.vue'

const series = [
  {
    ticker: 'XLK',
    label: 'XLK',
    points: [
      { date: '2024-01-01', x: 102, y: 101, quadrant: 'leading' as const },
      { date: '2024-03-01', x: 104, y: 103, quadrant: 'leading' as const },
    ],
  },
  {
    ticker: 'XLF',
    label: 'XLF',
    visible: false,
    points: [{ date: '2024-03-01', x: 97, y: 98, quadrant: 'lagging' as const }],
  },
]

describe('RrgChart points', () => {
  it('renders visible current points with test hooks', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
      },
    })

    const point = wrapper.get('[data-testid="rrg-point-XLK"]')
    expect(point.attributes('data-x')).toBe('104')
    expect(point.attributes('data-y')).toBe('103')
    expect(point.attributes('data-quadrant')).toBe('leading')
    expect(wrapper.find('[data-testid="rrg-point-XLF"]').exists()).toBe(false)
    expect(wrapper.get('[data-testid="rrg-label-XLK"]').text()).toBe('XLK')
  })
})
