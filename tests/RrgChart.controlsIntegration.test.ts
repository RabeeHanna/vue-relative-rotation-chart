import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import RrgChart from '../src/components/RrgChart.vue'
import RrgChartControlsPanel from '../src/components/RrgChartControlsPanel.vue'
import RrgSeriesVisibilityControls from '../src/components/RrgSeriesVisibilityControls.vue'
import { mockSeries } from '../src/scenarios'
import { seriesTickers } from '../src/composables/useRrgSeriesVisibility'

const selectedDate = '2024-03-01'

function mountChartWithControls() {
  const visibleTickers = ref(seriesTickers(mockSeries))
  const wrapper = mount(
    {
      components: { RrgChart, RrgChartControlsPanel },
      setup() {
        return {
          series: mockSeries,
          visibleTickers,
          selectedDate,
          viewportMode: 'fit' as const,
          tailLength: 10,
          labelMode: 'auto' as const,
          showTailFade: false,
        }
      },
      template: `
        <div>
          <RrgChartControlsPanel
            v-model:visible-tickers="visibleTickers"
            v-model:viewport-mode="viewportMode"
            v-model:tail-length="tailLength"
            v-model:label-mode="labelMode"
            v-model:show-tail-fade="showTailFade"
            :series="series"
            :sections="['visibility']"
          />
          <RrgChart
            :series="series"
            :selected-date="selectedDate"
            v-model:visible-tickers="visibleTickers"
          />
        </div>
      `,
    },
  )
  return { wrapper, visibleTickers }
}

function chartTickers(wrapper: ReturnType<typeof mount>) {
  return wrapper
    .findAll('[data-testid^="rrg-point-"]')
    .map((node) => node.attributes('data-ticker'))
}

describe('RrgChart controls integration', () => {
  it('hides a ticker from the chart when visibility controls uncheck it', async () => {
    const { wrapper } = mountChartWithControls()
    expect(chartTickers(wrapper)).toContain('XLK')

    await wrapper.get('[data-testid="rrg-series-visibility-check-XLK"]').setValue(false)
    expect(chartTickers(wrapper)).not.toContain('XLK')
  })

  it('restores prior visibility after solo when the series is unchanged', async () => {
    const { wrapper, visibleTickers } = mountChartWithControls()

    await wrapper.get('[data-testid="rrg-series-visibility-solo-XLK"]').trigger('click')
    expect(visibleTickers.value).toEqual(['XLK'])

    await wrapper.get('[data-testid="rrg-series-visibility-restore"]').trigger('click')
    expect(visibleTickers.value).toEqual(seriesTickers(mockSeries))
    expect(chartTickers(wrapper)).toContain('XLF')
  })

  it('invalidates solo restore when the series set changes', async () => {
    const wrapper = mount(
      {
        components: { RrgSeriesVisibilityControls },
        setup() {
          const series = ref(mockSeries)
          const visibleTickers = ref(seriesTickers(mockSeries))
          return { series, visibleTickers }
        },
        template:
          '<RrgSeriesVisibilityControls v-model:visible-tickers="visibleTickers" :series="series" />',
      },
    )

    await wrapper.get('[data-testid="rrg-series-visibility-solo-XLK"]').trigger('click')
    expect(wrapper.vm.visibleTickers).toEqual(['XLK'])

    wrapper.vm.series = mockSeries.filter((item) => item.ticker !== 'XLF')
    await wrapper.vm.$nextTick()

    expect(wrapper.get('[data-testid="rrg-series-visibility-restore"]').attributes('disabled')).toBeDefined()
    await wrapper.get('[data-testid="rrg-series-visibility-restore"]').trigger('click')
    expect(wrapper.vm.visibleTickers).toEqual(['XLK'])
  })

  it('still supports applyVisibleTickers for adapter-style hosts', async () => {
    const { applyVisibleTickers } = await import('../src/composables/useRrgSeriesVisibility')
    const filtered = applyVisibleTickers(mockSeries, ['XLK'])
    const wrapper = mount(RrgChart, {
      props: {
        series: filtered,
        selectedDate,
      },
    })

    expect(chartTickers(wrapper)).toEqual(['XLK'])
  })
})
