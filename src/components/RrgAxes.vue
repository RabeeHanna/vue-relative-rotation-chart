<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { RrgScale } from '../composables/useRrgScales'
import type { ResolvedRrgChartCopy } from '../types/copy'
import { RRG_CHART_COPY_DEFAULTS } from '../types/copy'
import type { ResolvedRrgChartFormatters } from '../utils/chartFormatters'
import { RRG_CHART_FORMATTER_DEFAULTS } from '../utils/chartFormatters'
import { generateTicks } from '../utils/ticks'

const props = defineProps({
  xScale: { type: Function as PropType<RrgScale>, required: true },
  yScale: { type: Function as PropType<RrgScale>, required: true },
  showGrid: { type: Boolean, default: true },
  copy: {
    type: Object as PropType<ResolvedRrgChartCopy>,
    default: () => RRG_CHART_COPY_DEFAULTS,
  },
  formatters: {
    type: Object as PropType<ResolvedRrgChartFormatters>,
    default: () => RRG_CHART_FORMATTER_DEFAULTS,
  },
})

const xDomain = computed(() => props.xScale.domain() as [number, number])
const yDomain = computed(() => props.yScale.domain() as [number, number])
const plotWidth = computed(() => {
  const r = props.xScale.range() as [number, number]
  return Math.abs(r[1] - r[0])
})
const plotHeight = computed(() => {
  const r = props.yScale.range() as [number, number]
  return Math.abs(r[0] - r[1])
})

const xTicks = computed(() => generateTicks(xDomain.value[0], xDomain.value[1], 5))
const yTicks = computed(() => generateTicks(yDomain.value[0], yDomain.value[1], 5))

const centerX = computed(() => props.xScale(100))
const centerY = computed(() => props.yScale(100))

function formatTick(value: number, axis: 'x' | 'y'): string {
  return props.formatters.formatAxisTick(value, axis)
}
</script>

<template>
  <g class="rrg-axes" data-testid="rrg-axes">
    <g v-if="showGrid" class="rrg-grid" data-testid="rrg-grid">
      <line
        v-for="tick in xTicks"
        :key="`vg-${tick}`"
        class="rrg-grid-line"
        :x1="xScale(tick)"
        :x2="xScale(tick)"
        y1="0"
        :y2="plotHeight"
        stroke="var(--rrg-grid, rgba(0, 0, 0, 0.08))"
        stroke-width="1"
        shape-rendering="crispEdges"
      />
      <line
        v-for="tick in yTicks"
        :key="`hg-${tick}`"
        class="rrg-grid-line"
        x1="0"
        :x2="plotWidth"
        :y1="yScale(tick)"
        :y2="yScale(tick)"
        stroke="var(--rrg-grid, rgba(0, 0, 0, 0.08))"
        stroke-width="1"
        shape-rendering="crispEdges"
      />
    </g>

    <line
      class="rrg-center-line"
      data-testid="rrg-center-x"
      :x1="centerX"
      :x2="centerX"
      y1="0"
      :y2="plotHeight"
      stroke="var(--rrg-center-line, rgba(0, 0, 0, 0.25))"
      stroke-width="1.25"
      shape-rendering="crispEdges"
    />
    <line
      class="rrg-center-line"
      data-testid="rrg-center-y"
      x1="0"
      :x2="plotWidth"
      :y1="centerY"
      :y2="centerY"
      stroke="var(--rrg-center-line, rgba(0, 0, 0, 0.25))"
      stroke-width="1.25"
      shape-rendering="crispEdges"
    />

    <line
      class="rrg-axis-line"
      x1="0"
      :x2="plotWidth"
      :y1="plotHeight"
      :y2="plotHeight"
      stroke="var(--rrg-axis, rgba(0, 0, 0, 0.3))"
      stroke-width="1"
      shape-rendering="crispEdges"
    />
    <line
      class="rrg-axis-line"
      x1="0"
      x2="0"
      y1="0"
      :y2="plotHeight"
      stroke="var(--rrg-axis, rgba(0, 0, 0, 0.3))"
      stroke-width="1"
      shape-rendering="crispEdges"
    />

    <g class="rrg-x-ticks" data-testid="rrg-x-ticks">
      <g v-for="tick in xTicks" :key="`xt-${tick}`">
        <line
          class="rrg-tick"
          :x1="xScale(tick)"
          :x2="xScale(tick)"
          :y1="plotHeight"
          :y2="plotHeight + 5"
          stroke="var(--rrg-axis, rgba(0, 0, 0, 0.3))"
          stroke-width="1"
          shape-rendering="crispEdges"
        />
        <text
          class="rrg-tick-label"
          :x="xScale(tick)"
          :y="plotHeight + 18"
          text-anchor="middle"
          fill="var(--rrg-axis-label, rgba(0, 0, 0, 0.5))"
          font-size="11"
          font-family="var(--rrg-font-family, ui-sans-serif, system-ui, sans-serif)"
        >
          {{ formatTick(tick, 'x') }}
        </text>
      </g>
    </g>

    <g class="rrg-y-ticks" data-testid="rrg-y-ticks">
      <g v-for="tick in yTicks" :key="`yt-${tick}`">
        <line
          class="rrg-tick"
          x1="-5"
          x2="0"
          :y1="yScale(tick)"
          :y2="yScale(tick)"
          stroke="var(--rrg-axis, rgba(0, 0, 0, 0.3))"
          stroke-width="1"
          shape-rendering="crispEdges"
        />
        <text
          class="rrg-tick-label"
          x="-10"
          :y="yScale(tick)"
          text-anchor="end"
          dominant-baseline="middle"
          fill="var(--rrg-axis-label, rgba(0, 0, 0, 0.5))"
          font-size="11"
          font-family="var(--rrg-font-family, ui-sans-serif, system-ui, sans-serif)"
        >
          {{ formatTick(tick, 'y') }}
        </text>
      </g>
    </g>

    <text
      class="rrg-axis-title"
      data-testid="rrg-axis-label-x"
      :x="plotWidth / 2"
      :y="plotHeight + 36"
      text-anchor="middle"
      fill="var(--rrg-axis-label, rgba(0, 0, 0, 0.5))"
      font-size="11"
      font-family="var(--rrg-font-family, ui-sans-serif, system-ui, sans-serif)"
    >
      {{ copy.axisTitleX }}
    </text>
    <text
      class="rrg-axis-title"
      data-testid="rrg-axis-label-y"
      :transform="`translate(-40, ${plotHeight / 2}) rotate(-90)`"
      text-anchor="middle"
      fill="var(--rrg-axis-label, rgba(0, 0, 0, 0.5))"
      font-size="11"
      font-family="var(--rrg-font-family, ui-sans-serif, system-ui, sans-serif)"
    >
      {{ copy.axisTitleY }}
    </text>
  </g>
</template>
