import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgSeriesVisibilityControls from '../src/components/RrgSeriesVisibilityControls.vue'
import { mockSeries } from '../src/scenarios'

describe('RrgSeriesVisibilityControls', () => {
  it('toggles checkboxes and bulk actions', async () => {
    const wrapper = mount(RrgSeriesVisibilityControls, {
      props: {
        series: mockSeries,
        visibleTickers: seriesTickers(mockSeries),
        'onUpdate:visibleTickers': (value: string[]) =>
          wrapper.setProps({ visibleTickers: value }),
      },
    })

    await wrapper.get('[data-testid="rrg-series-visibility-hide-all"]').trigger('click')
    expect(wrapper.props('visibleTickers')).toEqual([])

    await wrapper.get('[data-testid="rrg-series-visibility-show-all"]').trigger('click')
    expect(wrapper.props('visibleTickers')).toEqual(mockSeries.map((s) => s.ticker))

    await wrapper.get('[data-testid="rrg-series-visibility-solo-XLK"]').trigger('click')
    expect(wrapper.props('visibleTickers')).toEqual(['XLK'])

    await wrapper.get('[data-testid="rrg-series-visibility-restore"]').trigger('click')
    expect(wrapper.props('visibleTickers')).toEqual(mockSeries.map((s) => s.ticker))
  })

  it('disables restore until solo snapshot exists', async () => {
    const wrapper = mount(RrgSeriesVisibilityControls, {
      props: {
        series: mockSeries,
        visibleTickers: mockSeries.map((s) => s.ticker),
      },
    })

    expect(wrapper.get('[data-testid="rrg-series-visibility-restore"]').attributes('disabled')).toBeDefined()
    await wrapper.get('[data-testid="rrg-series-visibility-solo-XLK"]').trigger('click')
    expect(wrapper.get('[data-testid="rrg-series-visibility-restore"]').attributes('disabled')).toBeUndefined()
  })
})

function seriesTickers(series: typeof mockSeries) {
  return series.map((item) => item.ticker)
}
