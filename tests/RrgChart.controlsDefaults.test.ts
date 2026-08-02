import { describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'
import { mount } from '@vue/test-utils'
import RrgChart from '../src/components/RrgChart.vue'
import RrgDisplaySettingsControls from '../src/components/RrgDisplaySettingsControls.vue'
import { RRG_CHART_DEFAULTS } from '../src/types/defaults'
import { mockSeries } from '../src/scenarios'

const Host = defineComponent({
  components: { RrgChart, RrgDisplaySettingsControls },
  setup() {
    const tailLength = ref(RRG_CHART_DEFAULTS.tailLength)
    const labelMode = ref(RRG_CHART_DEFAULTS.labelMode)
    const showTailFade = ref(RRG_CHART_DEFAULTS.showTailFade)
    const selectedDate = mockSeries[0].points.at(-1)!.date
    return {
      series: mockSeries,
      selectedDate,
      tailLength,
      labelMode,
      showTailFade,
    }
  },
  template: `
    <div>
      <RrgDisplaySettingsControls
        v-model:tail-length="tailLength"
        v-model:label-mode="labelMode"
        v-model:show-tail-fade="showTailFade"
      />
      <RrgChart
        :series="series"
        :selected-date="selectedDate"
        :tail-length="tailLength"
        :label-mode="labelMode"
        :show-tail-fade="showTailFade"
        :width="640"
        :height="480"
      />
    </div>
  `,
})

describe('chart + display controls defaults', () => {
  it('shows the chart default tail length as a selected option', () => {
    const wrapper = mount(Host)

    const select = wrapper.get('[data-testid="rrg-display-tail-length"]')
    expect((select.element as HTMLSelectElement).value).toBe(
      String(RRG_CHART_DEFAULTS.tailLength),
    )
    expect(select.findAll('option').map((o) => o.text())).toContain('10')

    expect(wrapper.get('[data-testid="rrg-chart"]').exists()).toBe(true)
  })

  it('inserts a custom tail length into the select options', () => {
    const CustomHost = defineComponent({
      components: { RrgDisplaySettingsControls },
      setup() {
        const tailLength = ref(15)
        return { tailLength, labelMode: ref('auto'), showTailFade: ref(false) }
      },
      template: `
        <RrgDisplaySettingsControls
          v-model:tail-length="tailLength"
          v-model:label-mode="labelMode"
          v-model:show-tail-fade="showTailFade"
        />
      `,
    })
    const wrapper = mount(CustomHost)

    const options = wrapper
      .get('[data-testid="rrg-display-tail-length"]')
      .findAll('option')
      .map((o) => o.text())
    expect(options).toContain('15')
    expect((wrapper.get('[data-testid="rrg-display-tail-length"]').element as HTMLSelectElement).value).toBe(
      '15',
    )
  })
})
