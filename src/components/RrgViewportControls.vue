<script setup lang="ts">
import type { RrgViewportMode } from '../types/rrg'
import {
  RRG_VIEWPORT_MODES,
  rrgViewportModeDescription,
  rrgViewportModeLabel,
} from '../utils/viewportLabels'
import './RrgViewportControls.css'

withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
)

const viewportMode = defineModel<RrgViewportMode>('viewportMode', { required: true })
</script>

<template>
  <div
    class="rrg-viewport"
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
