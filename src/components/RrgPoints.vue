<script setup lang="ts">
import type { PropType } from 'vue'
import type { RrgRenderPoint } from '../types/rrg'
import type { RrgScale } from '../composables/useRrgScales'

defineProps({
  currentPoints: {
    type: Array as PropType<RrgRenderPoint[]>,
    required: true,
  },
  xScale: { type: Function as PropType<RrgScale>, required: true },
  yScale: { type: Function as PropType<RrgScale>, required: true },
  pointRadius: { type: Number, default: 5.5 },
})
</script>

<template>
  <g class="rrg-points" data-testid="rrg-points">
    <circle
      v-for="point in currentPoints"
      :key="point.ticker"
      class="rrg-point"
      :cx="xScale(point.x)"
      :cy="yScale(point.y)"
      :r="pointRadius"
      :fill="point.color ?? '#4e79a7'"
      stroke="var(--rrg-point-stroke, #fff)"
      stroke-width="1.5"
      :data-testid="`rrg-point-${point.ticker}`"
      :data-ticker="point.ticker"
      :data-x="point.x"
      :data-y="point.y"
      :data-quadrant="point.quadrant"
    />
  </g>
</template>
