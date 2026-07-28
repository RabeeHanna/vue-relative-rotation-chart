<script setup lang="ts">
import type { RrgViewportMode } from '../types/rrg'
import {
  RRG_VIEWPORT_MODES,
  rrgViewportModeDescription,
  rrgViewportModeLabel,
} from '../utils/viewportLabels'
import './rrgControlsShared.css'
import './RrgViewportControls.css'

withDefaults(
  defineProps<{
    disabled?: boolean
    dark?: boolean
    /** Inherit panel tokens when composed inside `RrgChartControlsPanel`. */
    inset?: boolean
  }>(),
  {
    disabled: false,
    dark: false,
    inset: false,
  },
)

const viewportMode = defineModel<RrgViewportMode>('viewportMode', { required: true })
</script>

<template>
  <div
    class="rrg-viewport"
    :class="[
      inset ? 'rrg-controls-surface--inset' : 'rrg-controls-surface',
      { dark },
    ]"
    data-testid="rrg-viewport"
    role="radiogroup"
    aria-label="Chart viewport mode"
  >
    <label
      v-for="mode in RRG_VIEWPORT_MODES"
      :key="mode"
      class="rrg-viewport__option"
      :title="rrgViewportModeDescription(mode)"
    >
      <input
        v-model="viewportMode"
        type="radio"
        :value="mode"
        :disabled="disabled"
        :data-testid="`rrg-viewport-${mode}`"
      />
      {{ rrgViewportModeLabel(mode) }}
    </label>
  </div>
</template>
