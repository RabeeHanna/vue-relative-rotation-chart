<script setup lang="ts">
import type { RrgLabelMode } from '../types/rrg'
import {
  RRG_LABEL_MODES,
  rrgLabelModeDescription,
  rrgLabelModeLabel,
} from '../utils/labelModeLabels'
import './RrgDisplaySettingsControls.css'

withDefaults(
  defineProps<{
    disabled?: boolean
    /** Tail-length select options (numeric presets). */
    tailLengthPresets?: number[]
  }>(),
  {
    disabled: false,
    tailLengthPresets: () => [4, 8, 12, 16, 24],
  },
)

const tailLength = defineModel<number>('tailLength', { required: true })
const labelMode = defineModel<RrgLabelMode>('labelMode', { required: true })
const showTailFade = defineModel<boolean>('showTailFade', { required: true })
</script>

<template>
  <div
    class="rrg-display-settings"
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
        <option v-for="preset in tailLengthPresets" :key="preset" :value="preset">
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
