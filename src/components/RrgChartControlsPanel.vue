<script setup lang="ts">
import type { RrgLabelMode, RrgRenderSeries, RrgViewportMode } from '../types/rrg'
import { RRG_TAIL_LENGTH_PRESETS } from '../types/defaults'
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
    /** Tail-length select is disabled when full-history mode is on. */
    displayDisabled?: boolean
    dark?: boolean
    sections?: RrgChartControlsSection[]
    /** Tail-length select presets (deduplicated, sorted; current value inserted when absent). */
    tailLengthPresets?: readonly number[]
    defaultOpen?: boolean
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
    aria-label="Chart controls"
  >
    <details
      v-if="showSection('viewport')"
      class="rrg-chart-controls__section"
      data-testid="rrg-chart-controls-viewport-section"
      :open="defaultOpen || undefined"
    >
      <summary>Viewport</summary>
      <RrgViewportControls
        v-model:viewport-mode="viewportMode"
        :disabled="disabled"
        :dark="dark"
        inset
      />
    </details>

    <details
      v-if="showSection('display')"
      class="rrg-chart-controls__section"
      data-testid="rrg-chart-controls-display-section"
      :open="defaultOpen || undefined"
    >
      <summary>Display</summary>
      <RrgDisplaySettingsControls
        v-model:tail-length="tailLength"
        v-model:label-mode="labelMode"
        v-model:show-tail-fade="showTailFade"
        :tail-length-presets="tailLengthPresets"
        :disabled="disabled || displayDisabled"
        :dark="dark"
        inset
      />
    </details>

    <details
      v-if="showSection('visibility')"
      class="rrg-chart-controls__section"
      data-testid="rrg-chart-controls-visibility-section"
      :open="defaultOpen || undefined"
    >
      <summary>Series</summary>
      <RrgSeriesVisibilityControls
        v-model:visible-tickers="visibleTickers"
        :series="series"
        :disabled="disabled"
        :dark="dark"
        inset
      />
    </details>
  </div>
</template>
