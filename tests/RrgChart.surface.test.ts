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

describe('RrgChart C3 surface', () => {
  it('renders axes, center lines, and quadrant labels', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
      },
    })

    expect(wrapper.get('[data-testid="rrg-svg-root"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="rrg-axes"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="rrg-center-x"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="rrg-center-y"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="rrg-quadrant-leading"]').text()).toBe('Leading')
    expect(wrapper.get('[data-testid="rrg-axis-label-x"]').text()).toContain('RS-Ratio')
  })

  it('hides axes/grid/quadrants via props', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
        showAxes: false,
        showQuadrantLabels: false,
      },
    })

    expect(wrapper.find('[data-testid="rrg-axes"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="rrg-quadrants"]').exists()).toBe(false)
  })
})
