<script setup lang="ts">
import { computed } from 'vue'
import type { RrgLabelMode } from '../types/rrg'
import { RRG_TAIL_LENGTH_PRESETS } from '../types/defaults'
import type { ResolvedRrgControlsCopy } from '../types/controlsCopy'
import { RRG_CONTROLS_COPY_DEFAULTS } from '../types/controlsCopy'
import { resolveTailLengthPresets } from '../utils/tailLengthPresets'
import { RRG_LABEL_MODES } from '../utils/labelModeLabels'
import './rrgControlsShared.css'
import './RrgDisplaySettingsControls.css'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    dark?: boolean
    inset?: boolean
    tailLengthPresets?: readonly number[]
    controlsCopy?: ResolvedRrgControlsCopy
  }>(),
  {
    disabled: false,
    dark: false,
    inset: false,
    tailLengthPresets: () => RRG_TAIL_LENGTH_PRESETS,
    controlsCopy: () => RRG_CONTROLS_COPY_DEFAULTS,
  },
)

const tailLength = defineModel<number>('tailLength', { required: true })
const labelMode = defineModel<RrgLabelMode>('labelMode', { required: true })
const showTailFade = defineModel<boolean>('showTailFade', { required: true })

const resolvedTailLengthPresets = computed(() =>
  resolveTailLengthPresets(tailLength.value, props.tailLengthPresets),
)

function labelModeLabel(mode: RrgLabelMode): string {
  const c = props.controlsCopy
  if (mode === 'always') return c.labelAlways
  if (mode === 'hover') return c.labelHover
  return c.labelAuto
}

function labelModeDescription(mode: RrgLabelMode): string {
  const c = props.controlsCopy
  if (mode === 'always') return c.labelAlwaysDescription
  if (mode === 'hover') return c.labelHoverDescription
  return c.labelAutoDescription
}
</script>

<template>
  <div
    class="rrg-display-settings"
    :class="[
      inset ? 'rrg-controls-surface--inset' : 'rrg-controls-surface',
      { dark },
    ]"
    data-testid="rrg-display-settings"
    role="group"
    :aria-label="controlsCopy.displayGroup"
  >
    <label class="rrg-display-settings__field">
      {{ controlsCopy.tail }}
      <select
        v-model.number="tailLength"
        data-testid="rrg-display-tail-length"
        :disabled="disabled"
      >
        <option v-for="preset in resolvedTailLengthPresets" :key="preset" :value="preset">
          {{ preset }}
        </option>
      </select>
    </label>

    <label class="rrg-display-settings__field">
      {{ controlsCopy.labels }}
      <select
        v-model="labelMode"
        data-testid="rrg-display-label-mode"
        :disabled="disabled"
      >
        <option
          v-for="mode in RRG_LABEL_MODES"
          :key="mode"
          :value="mode"
          :title="labelModeDescription(mode)"
        >
          {{ labelModeLabel(mode) }}
        </option>
      </select>
    </label>

    <label class="rrg-display-settings__check">
      <input
        v-model="showTailFade"
        type="checkbox"
        data-testid="rrg-display-tail-fade"
        :disabled="disabled"
      >
      {{ controlsCopy.tailFade }}
    </label>
  </div>
</template>
