import { describe, expect, expectTypeOf, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { RrgChart, RRG_CHART_DEFAULTS, RRG_PLAYBACK_DEFAULTS, RRG_TAIL_LENGTH_PRESETS } from '../src'
import type {
  RrgChartEmits,
  RrgChartInput,
  RrgChartProps,
  RrgLabelMode,
  RrgPlaybackControlsEmits,
  RrgPlaybackControlsProps,
  RrgPlaybackLabelStyle,
  RrgPlaybackLayout,
  RrgQuadrant,
  RrgRenderPoint,
  RrgRenderSeries,
  RrgSeriesPoint,
  RrgViewportMode,
} from '../src'

const sampleSeries: RrgRenderSeries[] = [
  {
    ticker: 'XLK',
    label: 'XLK',
    name: 'Technology',
    points: [
      { date: '2024-01-01', x: 102, y: 101, quadrant: 'leading' },
      { date: '2024-03-01', x: 104, y: 101.2, quadrant: 'leading' },
    ],
  },
]

describe('public type contract', () => {
  it('exports the expected public type names (compile-time)', () => {
    expectTypeOf<RrgQuadrant>().toEqualTypeOf<
      'leading' | 'weakening' | 'lagging' | 'improving'
    >()
    expectTypeOf<RrgViewportMode>().toEqualTypeOf<'fit' | 'max' | 'center'>()
    expectTypeOf<RrgLabelMode>().toEqualTypeOf<'auto' | 'always' | 'hover'>()
    expectTypeOf<RrgPlaybackLabelStyle>().toEqualTypeOf<'icon' | 'icon-text'>()
    expectTypeOf<RrgPlaybackLayout>().toEqualTypeOf<'auto' | 'stacked' | 'inline'>()
    expectTypeOf<RrgSeriesPoint>().toHaveProperty('date')
    expectTypeOf<RrgRenderPoint>().toHaveProperty('ticker')
    expectTypeOf<RrgRenderSeries>().toHaveProperty('points')
    expectTypeOf<RrgChartInput>().toHaveProperty('selectedDate')
    expectTypeOf<RrgChartProps>().not.toHaveProperty('showPatterns')
    expectTypeOf<RrgChartProps>().toHaveProperty('tickerLabelAlwaysVisible')
    expectTypeOf<RrgChartProps>().toHaveProperty('showTailFade')
    expectTypeOf<RrgChartEmits>().toHaveProperty('pointHover')
    expectTypeOf<RrgPlaybackControlsProps>().toHaveProperty('dates')
    expectTypeOf<RrgPlaybackControlsProps>().toHaveProperty('labelStyle')
    expectTypeOf<RrgPlaybackControlsProps>().toHaveProperty('layout')
    expectTypeOf<RrgPlaybackControlsEmits>().toHaveProperty('update:selectedDate')
  })

  it('includes optional accessibility identity props', () => {
    expectTypeOf<RrgChartProps['tickerLabelAlwaysVisible']>().toEqualTypeOf<
      boolean | undefined
    >()
  })

  it('exposes documented default constants', () => {
    expect(RRG_CHART_DEFAULTS.tailLength).toBe(10)
    expect(RRG_CHART_DEFAULTS.viewportMode).toBe('fit')
    expect(RRG_CHART_DEFAULTS.labelMode).toBe('auto')
    expect(RRG_CHART_DEFAULTS.tickerLabelAlwaysVisible).toBe(false)
    expect(RRG_CHART_DEFAULTS.showTailFade).toBe(false)
    expect(RRG_CHART_DEFAULTS.pointRadius).toBe(5.5)
    expect(RRG_CHART_DEFAULTS.hitRadius).toBe(12)
    expect(RRG_TAIL_LENGTH_PRESETS).toContain(RRG_CHART_DEFAULTS.tailLength)
    expect(RRG_PLAYBACK_DEFAULTS.labelStyle).toBe('icon')
  })
})

describe('RrgChart props wiring', () => {
  it('requires series and selectedDate and applies accessibility defaults', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series: sampleSeries,
        selectedDate: '2024-03-01',
      },
    })

    const root = wrapper.get('[data-testid="rrg-chart"]')
    expect(root.attributes('data-selected-date')).toBe('2024-03-01')
    expect(root.attributes('data-date-status')).toBe('exact')
    expect(root.attributes('data-viewport-mode')).toBe('fit')
    expect(root.attributes('data-ticker-label-always-visible')).toBe('false')
    expect(root.attributes('data-show-tail-fade')).toBe('false')
  })

  it('honors tickerLabelAlwaysVisible overrides', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series: sampleSeries,
        selectedDate: '2024-03-01',
        tickerLabelAlwaysVisible: true,
        viewportMode: 'center',
      },
    })

    const root = wrapper.get('[data-testid="rrg-chart"]')
    expect(root.attributes('data-ticker-label-always-visible')).toBe('true')
    expect(root.attributes('data-viewport-mode')).toBe('center')
  })
})
