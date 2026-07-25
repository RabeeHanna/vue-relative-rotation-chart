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
  hitRadius: { type: Number, default: 12 },
  hoveredTicker: { type: String as PropType<string | null>, default: null },
})

defineEmits<{
  pointEnter: [point: RrgRenderPoint]
  pointLeave: []
  pointClick: [point: RrgRenderPoint]
}>()
</script>

<template>
  <g class="rrg-points" data-testid="rrg-points">
    <g
      v-for="point in currentPoints"
      :key="point.ticker"
      class="rrg-point-group"
      :data-testid="`rrg-point-${point.ticker}`"
      :data-ticker="point.ticker"
      :data-x="point.x"
      :data-y="point.y"
      :data-quadrant="point.quadrant"
      :opacity="
        hoveredTicker && point.ticker !== hoveredTicker ? 0.25 : 1
      "
    >
      <circle
        class="rrg-point-hit"
        :cx="xScale(point.x)"
        :cy="yScale(point.y)"
        :r="hitRadius"
        fill="transparent"
        style="cursor: pointer"
        @pointerenter="$emit('pointEnter', point)"
        @pointerleave="$emit('pointLeave')"
        @click="$emit('pointClick', point)"
      />
      <circle
        class="rrg-point"
        :cx="xScale(point.x)"
        :cy="yScale(point.y)"
        :r="pointRadius"
        :fill="point.color ?? '#4e79a7'"
        stroke="var(--rrg-point-stroke, #fff)"
        stroke-width="1.5"
        style="pointer-events: none"
      />
    </g>
  </g>
</template>
