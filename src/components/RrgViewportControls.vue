<script setup lang="ts">
import type { RrgViewportMode } from '../types/rrg'
import type { ResolvedRrgControlsCopy } from '../types/controlsCopy'
import { RRG_CONTROLS_COPY_DEFAULTS } from '../types/controlsCopy'
import { RRG_VIEWPORT_MODES } from '../utils/viewportLabels'
import './rrgControlsShared.css'
import './RrgViewportControls.css'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    dark?: boolean
    inset?: boolean
    controlsCopy?: ResolvedRrgControlsCopy
  }>(),
  {
    disabled: false,
    dark: false,
    inset: false,
    controlsCopy: () => RRG_CONTROLS_COPY_DEFAULTS,
  },
)

const viewportMode = defineModel<RrgViewportMode>('viewportMode', { required: true })

function modeLabel(mode: RrgViewportMode): string {
  const c = props.controlsCopy
  if (mode === 'max') return c.viewportMax
  if (mode === 'center') return c.viewportCenter
  return c.viewportFit
}

function modeDescription(mode: RrgViewportMode): string {
  const c = props.controlsCopy
  if (mode === 'max') return c.viewportMaxDescription
  if (mode === 'center') return c.viewportCenterDescription
  return c.viewportFitDescription
}
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
    :aria-label="controlsCopy.viewportGroup"
  >
    <label
      v-for="mode in RRG_VIEWPORT_MODES"
      :key="mode"
      class="rrg-viewport__option"
      :title="modeDescription(mode)"
    >
      <input
        v-model="viewportMode"
        type="radio"
        :value="mode"
        :disabled="disabled"
        :data-testid="`rrg-viewport-${mode}`"
      >
      {{ modeLabel(mode) }}
    </label>
  </div>
</template>
