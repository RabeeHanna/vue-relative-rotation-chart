import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { RrgChart, resolveChartDate, collectSeriesDates } from '../src'
import type { RrgRenderSeries } from '../src'

const series: RrgRenderSeries[] = [
  {
    ticker: 'XLK',
    label: 'XLK',
    points: [
      { date: '2024-01-01', x: 102, y: 101, quadrant: 'leading' },
      { date: '2024-01-15', x: 103, y: 100, quadrant: 'leading' },
      { date: '2024-02-01', x: 104, y: 99, quadrant: 'weakening' },
    ],
  },
  {
    ticker: 'XLF',
    label: 'XLF',
    points: [
      { date: '2024-01-01', x: 96, y: 97, quadrant: 'lagging' },
      { date: '2024-01-15', x: 97, y: 98, quadrant: 'lagging' },
      { date: '2024-02-01', x: 98, y: 99, quadrant: 'improving' },
    ],
  },
]

describe('resolveChartDate', () => {
  it('collects unique ascending dates', () => {
    expect(collectSeriesDates(series)).toEqual([
      '2024-01-01',
      '2024-01-15',
      '2024-02-01',
    ])
  })

  it('reports exact matches', () => {
    expect(resolveChartDate(series, '2024-01-15')).toEqual({
      status: 'exact',
      date: '2024-01-15',
      dates: ['2024-01-01', '2024-01-15', '2024-02-01'],
    })
  })

  it('snaps mismatches to the nearest series date', () => {
    expect(resolveChartDate(series, '2024-01-10').status).toBe('snapped')
    expect(resolveChartDate(series, '2024-01-10').date).toBe('2024-01-15')
    expect(resolveChartDate(series, '2023-12-01').date).toBe('2024-01-01')
    expect(resolveChartDate(series, '2024-06-01').date).toBe('2024-02-01')
  })

  it('returns empty when there are no dates', () => {
    expect(resolveChartDate([], '2024-01-01')).toEqual({
      status: 'empty',
      date: '',
      dates: [],
    })
    expect(
      resolveChartDate(
        [{ ticker: 'X', label: 'X', points: [], visible: true }],
        '2024-01-01',
      ).status,
    ).toBe('empty')
  })
})

describe('RrgChart date resolve + empty state', () => {
  it('exposes data-date-status exact and renders points', () => {
    const wrapper = mount(RrgChart, {
      props: { series, selectedDate: '2024-01-15', width: 640, height: 480 },
    })
    const root = wrapper.get('[data-testid="rrg-chart"]')
    expect(root.attributes('data-date-status')).toBe('exact')
    expect(root.attributes('data-selected-date')).toBe('2024-01-15')
    expect(wrapper.find('[data-testid="rrg-chart-empty"]').exists()).toBe(false)
    expect(wrapper.get('[data-testid="rrg-point-XLK"]').exists()).toBe(true)
  })

  it('snaps selectedDate and still renders the nearest frame', () => {
    const wrapper = mount(RrgChart, {
      props: { series, selectedDate: '2024-01-10', width: 640, height: 480 },
    })
    const root = wrapper.get('[data-testid="rrg-chart"]')
    expect(root.attributes('data-date-status')).toBe('snapped')
    expect(root.attributes('data-selected-date')).toBe('2024-01-15')
    expect(wrapper.get('[data-testid="rrg-point-XLK"]').attributes('data-x')).toBe('103')
  })

  it('shows a visible empty state when series have no dates', () => {
    const wrapper = mount(RrgChart, {
      props: { series: [], selectedDate: '2024-01-01', width: 640, height: 480 },
    })
    const root = wrapper.get('[data-testid="rrg-chart"]')
    expect(root.attributes('data-date-status')).toBe('empty')
    const empty = wrapper.get('[data-testid="rrg-chart-empty"]')
    expect(empty.text()).toMatch(/No series dates/i)
    expect(empty.attributes('data-empty-reason')).toBe('no-dates')
    expect(wrapper.find('[data-testid="rrg-svg-root"]').exists()).toBe(false)
  })

  it('shows empty state when all series are hidden', () => {
    const hidden = series.map((item) => ({ ...item, visible: false }))
    const wrapper = mount(RrgChart, {
      props: { series: hidden, selectedDate: '2024-01-15', width: 640, height: 480 },
    })
    const empty = wrapper.get('[data-testid="rrg-chart-empty"]')
    expect(empty.text()).toMatch(/All series are hidden/i)
    expect(empty.attributes('data-empty-reason')).toBe('all-hidden')
    expect(wrapper.find('[data-testid="rrg-point-XLK"]').exists()).toBe(false)
  })

  it('exposes svg element for export when chart is rendered', () => {
    const wrapper = mount(RrgChart, {
      props: { series, selectedDate: '2024-01-15', width: 640, height: 480 },
    })
    const exposed = wrapper.vm as { getSvgElement?: () => SVGSVGElement | null }
    expect(exposed.getSvgElement?.()).toBeTruthy()
  })
})
