import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgChartControlsPanel from '../src/components/RrgChartControlsPanel.vue'
import type { RrgRenderSeries } from '../src/types/rrg'

const series: RrgRenderSeries[] = [
  {
    ticker: 'XLK',
    label: 'XLK',
    points: [{ date: '2024-01-01', x: 102, y: 101, quadrant: 'leading' }],
  },
  {
    ticker: 'XLF',
    label: 'XLF',
    points: [{ date: '2024-01-01', x: 96, y: 97, quadrant: 'lagging' }],
  },
]

describe('RrgChartControlsPanel', () => {
  it('composes viewport, display, and visibility sections', async () => {
    const wrapper = mount(RrgChartControlsPanel, {
      props: {
        series,
        viewportMode: 'fit',
        tailLength: 8,
        labelMode: 'auto',
        showTailFade: false,
        visibleTickers: ['XLK', 'XLF'],
        'onUpdate:viewportMode': (value: 'max') => wrapper.setProps({ viewportMode: value }),
        'onUpdate:labelMode': (value: 'hover') => wrapper.setProps({ labelMode: value }),
      },
    })

    expect(wrapper.get('[data-testid="rrg-chart-controls-panel"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="rrg-viewport"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="rrg-display-settings"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="rrg-series-visibility"]').exists()).toBe(true)

    await wrapper.get('[data-testid="rrg-viewport-max"]').setValue(true)
    expect(wrapper.emitted('update:viewportMode')).toEqual([['max']])

    await wrapper.get('[data-testid="rrg-display-label-mode"]').setValue('hover')
    expect(wrapper.emitted('update:labelMode')).toEqual([['hover']])
  })

  it('hides sections not listed in sections prop', () => {
    const wrapper = mount(RrgChartControlsPanel, {
      props: {
        series,
        sections: ['viewport'],
        viewportMode: 'fit',
        tailLength: 8,
        labelMode: 'auto',
        showTailFade: false,
        visibleTickers: ['XLK'],
      },
    })

    expect(wrapper.find('[data-testid="rrg-chart-controls-display-section"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="rrg-chart-controls-visibility-section"]').exists()).toBe(
      false,
    )
    expect(wrapper.get('[data-testid="rrg-viewport"]').exists()).toBe(true)
  })
})
