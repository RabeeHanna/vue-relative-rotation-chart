import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgChart from '../src/components/RrgChart.vue'
import { patternElementId, patternKindForIndex } from '../src/utils/patterns'

const series = [
  {
    ticker: 'XLK',
    label: 'XLK',
    name: 'Technology',
    points: [
      { date: '2024-01-01', x: 104, y: 103, quadrant: 'leading' as const },
      { date: '2024-03-01', x: 105, y: 102, quadrant: 'leading' as const },
    ],
  },
  {
    ticker: 'XLF',
    label: 'XLF',
    points: [
      { date: '2024-01-01', x: 96, y: 97, quadrant: 'lagging' as const },
      { date: '2024-03-01', x: 97, y: 98, quadrant: 'lagging' as const },
    ],
  },
]

describe('accessibility and test hooks', () => {
  it('exposes aria title/desc on the SVG root', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
      },
    })

    const svg = wrapper.get('[data-testid="rrg-svg-root"]')
    const labelledBy = svg.attributes('aria-labelledby')
    const describedBy = svg.attributes('aria-describedby')
    expect(svg.attributes('role')).toBe('img')
    expect(labelledBy).toBeTruthy()
    expect(describedBy).toBeTruthy()

    const title = wrapper.get(`#${labelledBy}`)
    const desc = wrapper.get(`#${describedBy}`)
    expect(title.text()).toContain('2024-03-01')
    expect(desc.text()).toContain('2 tickers')
    expect(desc.text()).toContain('Leading quadrant: XLK')
  })

  it('keeps data-testid hooks stable across selectedDate changes', async () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
      },
    })

    expect(wrapper.get('[data-testid="rrg-point-XLK"]').attributes('data-quadrant')).toBe(
      'leading',
    )
    expect(wrapper.get('[data-testid="rrg-label-XLK"]').attributes('data-visible')).toBe('true')
    expect(wrapper.get('[data-testid="rrg-tail-XLK"]').exists()).toBe(true)

    await wrapper.setProps({ selectedDate: '2024-01-01' })

    expect(wrapper.get('[data-testid="rrg-point-XLK"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="rrg-chart"]').attributes('data-selected-date')).toBe(
      '2024-01-01',
    )
    expect(wrapper.get('[data-testid="rrg-point-XLK"]').attributes('data-x')).toBe('104')
  })

  it('renders deterministic pattern fills when showPatterns is true', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
        showPatterns: true,
      },
    })

    expect(wrapper.get('[data-testid="rrg-patterns"]').exists()).toBe(true)
    expect(wrapper.get(`#${patternElementId('XLK')}`).attributes('data-pattern-kind')).toBe(
      patternKindForIndex(0),
    )
    expect(wrapper.find('.rrg-point-pattern').exists()).toBe(true)
  })

  it('makes points focusable and includes ticker in tooltip', async () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
      },
    })

    const hit = wrapper.get('[data-testid="rrg-point-XLK"] .rrg-point-hit')
    expect(hit.attributes('tabindex')).toBe('0')
    expect(hit.attributes('aria-label')).toContain('XLK')

    await hit.trigger('focus')
    const tooltip = wrapper.get('[data-testid="rrg-tooltip"]')
    expect(tooltip.attributes('data-ticker')).toBe('XLK')
    expect(tooltip.text()).toContain('XLK')
  })
})
