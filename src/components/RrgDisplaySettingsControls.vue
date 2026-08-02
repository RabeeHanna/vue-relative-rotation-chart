<script setup lang="ts">
import { computed } from 'vue'
import type { RrgLabelMode } from '../types/rrg'
import { RRG_TAIL_LENGTH_PRESETS } from '../types/defaults'
import { resolveTailLengthPresets } from '../utils/tailLengthPresets'
import {
  RRG_LABEL_MODES,
  rrgLabelModeDescription,
  rrgLabelModeLabel,
} from '../utils/labelModeLabels'
import './rrgControlsShared.css'
import './RrgDisplaySettingsControls.css'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    dark?: boolean
    inset?: boolean
    /** Tail-length select presets (deduplicated, sorted; current value inserted when absent). */
    tailLengthPresets?: readonly number[]
  }>(),
  {
    disabled: false,
    dark: false,
    inset: false,
    tailLengthPresets: () => RRG_TAIL_LENGTH_PRESETS,
  },
)

const tailLength = defineModel<number>('tailLength', { required: true })
const labelMode = defineModel<RrgLabelMode>('labelMode', { required: true })
const showTailFade = defineModel<boolean>('showTailFade', { required: true })

const resolvedTailLengthPresets = computed(() =>
  resolveTailLengthPresets(tailLength.value, props.tailLengthPresets),
)
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
    aria-label="Chart display settings"
  >
    <label class="rrg-display-settings__field">
      Tail
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
      Labels
      <select
        v-model="labelMode"
        data-testid="rrg-display-label-mode"
        :disabled="disabled"
      >
        <option
          v-for="mode in RRG_LABEL_MODES"
          :key="mode"
          :value="mode"
          :title="rrgLabelModeDescription(mode)"
        >
          {{ rrgLabelModeLabel(mode) }}
        </option>
      </select>
    </label>

    <label class="rrg-display-settings__check">
      <input
        v-model="showTailFade"
        type="checkbox"
        data-testid="rrg-display-tail-fade"
        :disabled="disabled"
      />
      Tail fade
    </label>
  </div>
</template>
