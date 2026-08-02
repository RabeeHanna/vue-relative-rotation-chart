<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { RrgScale } from '../composables/useRrgScales'
import type { ResolvedRrgChartCopy } from '../types/copy'
import { RRG_CHART_COPY_DEFAULTS } from '../types/copy'

const props = defineProps({
  xScale: { type: Function as PropType<RrgScale>, required: true },
  yScale: { type: Function as PropType<RrgScale>, required: true },
  copy: {
    type: Object as PropType<ResolvedRrgChartCopy>,
    default: () => RRG_CHART_COPY_DEFAULTS,
  },
})

const xDomain = computed(() => props.xScale.domain() as [number, number])
const yDomain = computed(() => props.yScale.domain() as [number, number])

const labels = computed(() => {
  const [x0, x1] = xDomain.value
  const [y0, y1] = yDomain.value
  const insetX = (x1 - x0) * 0.08
  const insetY = (y1 - y0) * 0.08
  const c = props.copy
  return [
    {
      id: 'leading',
      text: c.leading,
      x: props.xScale(x1 - insetX),
      y: props.yScale(y1 - insetY),
      anchor: 'end' as const,
    },
    {
      id: 'weakening',
      text: c.weakening,
      x: props.xScale(x1 - insetX),
      y: props.yScale(y0 + insetY),
      anchor: 'end' as const,
    },
    {
      id: 'lagging',
      text: c.lagging,
      x: props.xScale(x0 + insetX),
      y: props.yScale(y0 + insetY),
      anchor: 'start' as const,
    },
    {
      id: 'improving',
      text: c.improving,
      x: props.xScale(x0 + insetX),
      y: props.yScale(y1 - insetY),
      anchor: 'start' as const,
    },
  ]
})
</script>

<template>
  <g class="rrg-quadrants" data-testid="rrg-quadrants">
    <text
      v-for="label in labels"
      :key="label.id"
      class="rrg-quadrant-label"
      :data-testid="`rrg-quadrant-${label.id}`"
      :x="label.x"
      :y="label.y"
      :text-anchor="label.anchor"
      dominant-baseline="middle"
      fill="var(--rrg-quadrant-label, rgba(0, 0, 0, 0.15))"
      font-size="12"
      font-family="var(--rrg-font-family, ui-sans-serif, system-ui, sans-serif)"
      font-weight="500"
      letter-spacing="0.02em"
      pointer-events="none"
    >
      {{ label.text }}
    </text>
  </g>
</template>
