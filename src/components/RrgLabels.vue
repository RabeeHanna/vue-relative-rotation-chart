<script setup lang="ts">
import type { PropType } from 'vue'
import type { ResolvedLabel } from '../composables/useRrgLabelLayout'

defineProps({
  labels: { type: Array as PropType<ResolvedLabel[]>, required: true },
})
</script>

<template>
  <g class="rrg-labels" data-testid="rrg-labels">
    <text
      v-for="label in labels"
      :key="label.ticker"
      class="rrg-label"
      :class="{ 'rrg-label--hidden': !label.visible }"
      :x="label.x"
      :y="label.y"
      fill="var(--rrg-label, #222)"
      font-size="11"
      dominant-baseline="hanging"
      :data-testid="`rrg-label-${label.ticker}`"
      :data-visible="label.visible ? 'true' : 'false'"
      :opacity="label.visible ? 1 : 0"
      :pointer-events="label.visible ? 'none' : 'none'"
    >
      {{ label.label }}
    </text>
  </g>
</template>
