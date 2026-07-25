<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { RrgRenderPoint } from '../types/rrg'
import type { RrgScale } from '../composables/useRrgScales'
import { computeTooltipPosition } from '../utils/tooltipPosition'

const TOOLTIP_WIDTH = 168
const TOOLTIP_HEIGHT = 78

const props = defineProps({
  hoveredPoint: {
    type: Object as PropType<RrgRenderPoint | null>,
    default: null,
  },
  xScale: { type: Function as PropType<RrgScale>, required: true },
  yScale: { type: Function as PropType<RrgScale>, required: true },
  plotWidth: { type: Number, required: true },
  plotHeight: { type: Number, required: true },
})

const position = computed(() => {
  const point = props.hoveredPoint
  if (!point) return { x: 0, y: 0 }
  return computeTooltipPosition({
    pointX: props.xScale(point.x),
    pointY: props.yScale(point.y),
    tooltipWidth: TOOLTIP_WIDTH,
    tooltipHeight: TOOLTIP_HEIGHT,
    plotWidth: props.plotWidth,
    plotHeight: props.plotHeight,
  })
})
</script>

<template>
  <g
    v-if="hoveredPoint"
    class="rrg-tooltip"
    data-testid="rrg-tooltip"
    :transform="`translate(${position.x}, ${position.y})`"
    pointer-events="none"
  >
    <rect
      :width="TOOLTIP_WIDTH"
      :height="TOOLTIP_HEIGHT"
      rx="3"
      fill="var(--rrg-tooltip-bg)"
      stroke="var(--rrg-axis)"
      stroke-width="0.5"
    />
    <text dy="14" dx="8" font-size="11" fill="var(--rrg-label)" font-weight="600">
      {{ hoveredPoint.ticker }}
      <tspan
        v-if="hoveredPoint.name"
        font-weight="normal"
        fill="var(--rrg-axis-label)"
      >
        {{ ' ' + hoveredPoint.name }}
      </tspan>
    </text>
    <text dy="28" dx="8" font-size="10" fill="var(--rrg-axis-label)">
      {{ hoveredPoint.date }}
    </text>
    <text dy="41" dx="8" font-size="10" fill="var(--rrg-axis-label)">
      RS-Ratio: {{ hoveredPoint.x.toFixed(2) }}
    </text>
    <text dy="54" dx="8" font-size="10" fill="var(--rrg-axis-label)">
      RS-Momentum: {{ hoveredPoint.y.toFixed(2) }}
    </text>
    <text
      dy="67"
      dx="8"
      font-size="10"
      fill="var(--rrg-axis-label)"
      style="text-transform: capitalize"
    >
      Quadrant: {{ hoveredPoint.quadrant }}
    </text>
  </g>
</template>
