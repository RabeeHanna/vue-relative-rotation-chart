<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { RrgRenderPoint } from '../types/rrg'
import type { RrgScale } from '../composables/useRrgScales'
import { computeTooltipPosition } from '../utils/tooltipPosition'
import type { ResolvedRrgChartCopy } from '../types/copy'
import { RRG_CHART_COPY_DEFAULTS } from '../types/copy'

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
  copy: {
    type: Object as PropType<ResolvedRrgChartCopy>,
    default: () => RRG_CHART_COPY_DEFAULTS,
  },
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
    :data-ticker="hoveredPoint.ticker"
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
      {{ copy.rsRatio }}: {{ hoveredPoint.x.toFixed(2) }}
    </text>
    <text dy="54" dx="8" font-size="10" fill="var(--rrg-axis-label)">
      {{ copy.rsMomentum }}: {{ hoveredPoint.y.toFixed(2) }}
    </text>
    <text
      dy="67"
      dx="8"
      font-size="10"
      fill="var(--rrg-axis-label)"
    >
      {{ copy.quadrant }}:
      {{
        hoveredPoint.quadrant === 'leading'
          ? copy.leading
          : hoveredPoint.quadrant === 'weakening'
            ? copy.weakening
            : hoveredPoint.quadrant === 'lagging'
              ? copy.lagging
              : copy.improving
      }}
    </text>
  </g>
</template>
