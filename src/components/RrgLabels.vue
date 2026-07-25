<script setup lang="ts">
import type { PropType } from 'vue'
import type { RrgRenderPoint } from '../types/rrg'
import type { RrgScale } from '../composables/useRrgScales'

defineProps({
  points: { type: Array as PropType<RrgRenderPoint[]>, required: true },
  xScale: { type: Function as PropType<RrgScale>, required: true },
  yScale: { type: Function as PropType<RrgScale>, required: true },
  labelOffsetX: { type: Number, default: 8 },
  labelOffsetY: { type: Number, default: -8 },
})
</script>

<template>
  <g class="rrg-labels" data-testid="rrg-labels">
    <text
      v-for="point in points"
      :key="point.ticker"
      class="rrg-label"
      :x="xScale(point.x) + labelOffsetX"
      :y="yScale(point.y) + labelOffsetY"
      fill="var(--rrg-label, #222)"
      font-size="11"
      :data-testid="`rrg-label-${point.ticker}`"
      data-visible="true"
    >
      {{ point.label }}
    </text>
  </g>
</template>
