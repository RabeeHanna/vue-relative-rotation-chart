import { describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'
import { mount } from '@vue/test-utils'
import RrgChart from '../src/components/RrgChart.vue'
import RrgDisplaySettingsControls from '../src/components/RrgDisplaySettingsControls.vue'
import { RRG_CHART_DEFAULTS } from '../src/types/defaults'
import { mockSeries } from '../src/scenarios'

function tailVertexCount(wrapper: ReturnType<typeof mount>, ticker: string): number {
  const points = wrapper
    .get(`[data-testid="rrg-tail-${ticker}"] .rrg-tail-segment`)
    .attributes('points')
  return points ? points.split(' ').length : 0
}

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

describe('chart + display controls integration', () => {
  it('updates chart tail geometry when the select changes', async () => {
    const wrapper = mount(Host)
    const before = tailVertexCount(wrapper, 'XLK')
    expect(before).toBe(10)

    await wrapper.get('[data-testid="rrg-display-tail-length"]').setValue('4')
    await wrapper.vm.$nextTick()

    expect(tailVertexCount(wrapper, 'XLK')).toBe(4)
  })
})
