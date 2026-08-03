<script setup lang="ts">
import { computed } from 'vue'
import type { RrgLabelMode, RrgRenderSeries, RrgViewportMode } from '../types/rrg'
import { RRG_TAIL_LENGTH_PRESETS } from '../types/defaults'
import type { RrgControlsCopy } from '../types/controlsCopy'
import { mergeControlsCopy } from '../types/controlsCopy'
import RrgDisplaySettingsControls from './RrgDisplaySettingsControls.vue'
import RrgSeriesVisibilityControls from './RrgSeriesVisibilityControls.vue'
import RrgViewportControls from './RrgViewportControls.vue'
import './rrgControlsShared.css'
import './RrgChartControlsPanel.css'

export type RrgChartControlsSection = 'viewport' | 'display' | 'visibility'

const props = withDefaults(
  defineProps<{
    series: RrgRenderSeries[]
    disabled?: boolean
    displayDisabled?: boolean
    dark?: boolean
    sections?: RrgChartControlsSection[]
    tailLengthPresets?: readonly number[]
    defaultOpen?: boolean
    controlsCopy?: RrgControlsCopy
  }>(),
  {
    disabled: false,
    displayDisabled: false,
    dark: false,
    sections: () => ['viewport', 'display', 'visibility'],
    tailLengthPresets: () => RRG_TAIL_LENGTH_PRESETS,
    defaultOpen: true,
  },
)

const viewportMode = defineModel<RrgViewportMode>('viewportMode', { required: true })
const tailLength = defineModel<number>('tailLength', { required: true })
const labelMode = defineModel<RrgLabelMode>('labelMode', { required: true })
const showTailFade = defineModel<boolean>('showTailFade', { required: true })
const visibleTickers = defineModel<string[]>('visibleTickers', { required: true })

const resolvedControlsCopy = computed(() => mergeControlsCopy(props.controlsCopy))

function showSection(section: RrgChartControlsSection): boolean {
  return props.sections.includes(section)
}
</script>

<template>
  <div
    class="rrg-chart-controls rrg-controls-surface"
    :class="{ dark }"
    data-testid="rrg-chart-controls-panel"
    role="group"
    :aria-label="resolvedControlsCopy.chartControlsGroup"
  >
    <details
      v-if="showSection('viewport')"
      class="rrg-chart-controls__section"
      data-testid="rrg-chart-controls-viewport-section"
      :open="defaultOpen || undefined"
    >
      <summary>{{ resolvedControlsCopy.viewportSection }}</summary>
      <RrgViewportControls
        v-model:viewport-mode="viewportMode"
        :disabled="disabled"
        :dark="dark"
        :controls-copy="resolvedControlsCopy"
        inset
      />
    </details>

    <details
      v-if="showSection('display')"
      class="rrg-chart-controls__section"
      data-testid="rrg-chart-controls-display-section"
      :open="defaultOpen || undefined"
    >
      <summary>{{ resolvedControlsCopy.displaySection }}</summary>
      <RrgDisplaySettingsControls
        v-model:tail-length="tailLength"
        v-model:label-mode="labelMode"
        v-model:show-tail-fade="showTailFade"
        :tail-length-presets="tailLengthPresets"
        :disabled="disabled || displayDisabled"
        :dark="dark"
        :controls-copy="resolvedControlsCopy"
        inset
      />
    </details>

    <details
      v-if="showSection('visibility')"
      class="rrg-chart-controls__section"
      data-testid="rrg-chart-controls-visibility-section"
      :open="defaultOpen || undefined"
    >
      <summary>{{ resolvedControlsCopy.seriesSection }}</summary>
      <RrgSeriesVisibilityControls
        v-model:visible-tickers="visibleTickers"
        :series="series"
        :disabled="disabled"
        :dark="dark"
        :controls-copy="resolvedControlsCopy"
        inset
      />
    </details>
  </div>
</template>
