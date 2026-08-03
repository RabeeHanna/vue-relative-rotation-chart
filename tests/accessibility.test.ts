import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgChart from '../src/components/RrgChart.vue'
import RrgPlaybackControls from '../src/components/RrgPlaybackControls.vue'

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

  it('does not render hatch pattern fills (labels-first a11y)', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
      },
    })

    expect(wrapper.find('[data-testid="rrg-patterns"]').exists()).toBe(false)
    expect(wrapper.find('.rrg-point-pattern').exists()).toBe(false)
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

  it('activates points with Enter and Space when focused', async () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
      },
    })

    const hit = wrapper.get('[data-testid="rrg-point-XLF"] .rrg-point-hit')

    await hit.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('pointClick')?.[0]?.[0]).toMatchObject({ ticker: 'XLF' })

    await hit.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('pointClick')?.[1]?.[0]).toMatchObject({ ticker: 'XLF' })
  })

  it('exposes aria-pressed on the selected ticker point', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        selectedTicker: 'XLK',
        width: 640,
        height: 480,
      },
    })

    const selected = wrapper.get('[data-testid="rrg-point-XLK"] .rrg-point-hit')
    const other = wrapper.get('[data-testid="rrg-point-XLF"] .rrg-point-hit')
    expect(selected.attributes('aria-pressed')).toBe('true')
    expect(other.attributes('aria-pressed')).toBe('false')
  })

  it('assigns a chart region id for playback aria-controls', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
        regionId: 'linked-chart',
      },
    })

    expect(wrapper.get('[data-testid="rrg-chart"]').attributes('id')).toBe('linked-chart')
  })

  it('links playback scrubber to chart via aria-controls and valuetext', () => {
    const chart = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
        regionId: 'chart-a11y',
      },
    })

    const playback = mount(RrgPlaybackControls, {
      props: {
        dates: ['2024-01-01', '2024-03-01'],
        selectedDate: '2024-03-01',
        chartRegionId: 'chart-a11y',
      },
    })

    const scrubber = playback.get('[data-testid="rrg-playback-scrubber"]')
    expect(scrubber.attributes('aria-controls')).toBe('chart-a11y')
    expect(scrubber.attributes('aria-valuetext')).toContain('2024-03-01')
    expect(scrubber.attributes('aria-valuetext')).toContain('Frame 2 of 2')
    expect(chart.get('[data-testid="rrg-chart"]').attributes('id')).toBe('chart-a11y')

    chart.unmount()
    playback.unmount()
  })
})
