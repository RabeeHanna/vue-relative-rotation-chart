<script setup lang="ts">
import { computed, toRef, watch } from 'vue'
import { RRG_CHART_DEFAULTS, type RrgChartProps, type RrgRenderPoint } from '../types/rrg'
import { useRrgViewport } from '../composables/useRrgViewport'
import { useRrgScales } from '../composables/useRrgScales'
import { useRrgTailSlices } from '../composables/useRrgTailSlices'
import { useRrgLabelLayout } from '../composables/useRrgLabelLayout'
import { useRrgHoverState } from '../composables/useRrgHoverState'
import { useRrgChartSummary } from '../composables/useRrgChartSummary'
import { assignSeriesColors } from '../utils/colors'
import { RRG_DEFAULT_MARGIN } from '../utils/chartLayout'
import RrgSvgRoot from './RrgSvgRoot.vue'
import RrgAxes from './RrgAxes.vue'
import RrgQuadrants from './RrgQuadrants.vue'
import RrgPoints from './RrgPoints.vue'
import RrgLabels from './RrgLabels.vue'
import RrgTails from './RrgTails.vue'
import RrgTooltip from './RrgTooltip.vue'

const props = withDefaults(defineProps<RrgChartProps>(), {
  tailLength: RRG_CHART_DEFAULTS.tailLength,
  viewportMode: RRG_CHART_DEFAULTS.viewportMode,
  labelMode: RRG_CHART_DEFAULTS.labelMode,
  showQuadrantLabels: RRG_CHART_DEFAULTS.showQuadrantLabels,
  showGrid: RRG_CHART_DEFAULTS.showGrid,
  showAxes: RRG_CHART_DEFAULTS.showAxes,
  showPatterns: RRG_CHART_DEFAULTS.showPatterns,
  tickerLabelAlwaysVisible: RRG_CHART_DEFAULTS.tickerLabelAlwaysVisible,
  highlightedTicker: null,
  selectedTicker: null,
})

const emit = defineEmits<{
  pointHover: [point: RrgRenderPoint]
  pointLeave: []
  pointClick: [point: RrgRenderPoint]
}>()

const coloredSeries = computed(() => assignSeriesColors(props.series))
const seriesRef = coloredSeries
const selectedDateRef = toRef(props, 'selectedDate')
const tailLengthRef = toRef(props, 'tailLength')
const viewportModeRef = toRef(props, 'viewportMode')
const domain = useRrgViewport(seriesRef, selectedDateRef, tailLengthRef, viewportModeRef)
const plotWidth = computed(() => {
  const w = props.width ?? 640
  return Math.max(0, w - RRG_DEFAULT_MARGIN.left - RRG_DEFAULT_MARGIN.right)
})
const plotHeight = computed(() => {
  const h = props.height ?? 480
  return Math.max(0, h - RRG_DEFAULT_MARGIN.top - RRG_DEFAULT_MARGIN.bottom)
})
const { xScale, yScale } = useRrgScales(domain, plotWidth, plotHeight)

const { currentPoints, tailData } = useRrgTailSlices(
  seriesRef,
  selectedDateRef,
  tailLengthRef,
  xScale,
  yScale,
)

const { hoveredTicker, hoveredPoint, onPointEnter, onPointLeave, onPointClick } =
  useRrgHoverState()

const effectiveHoveredTicker = computed(
  () => hoveredTicker.value ?? props.highlightedTicker ?? null,
)

const { title: a11yTitle, description: a11yDescription } = useRrgChartSummary(
  selectedDateRef,
  viewportModeRef,
  currentPoints,
)

watch(hoveredPoint, (point) => {
  if (point) emit('pointHover', point)
  else emit('pointLeave')
})

function handlePointEnter(point: RrgRenderPoint) {
  onPointEnter(point)
}

function handlePointLeave() {
  onPointLeave()
}

function handlePointClick(point: RrgRenderPoint) {
  onPointClick(point)
  emit('pointClick', point)
}

function handleChartLeave() {
  onPointLeave()
}

const labelModeRef = toRef(props, 'labelMode')
const alwaysVisibleRef = toRef(props, 'tickerLabelAlwaysVisible')
const resolvedLabels = useRrgLabelLayout(
  currentPoints,
  labelModeRef,
  xScale,
  yScale,
  {
    tickerLabelAlwaysVisible: alwaysVisibleRef,
    hoveredTicker: effectiveHoveredTicker,
  },
)
</script>

<template>
  <div
    class="rrg-chart"
    data-testid="rrg-chart"
    :data-viewport-mode="viewportMode"
    :data-selected-date="selectedDate"
    :data-show-patterns="showPatterns ? 'true' : 'false'"
    :data-ticker-label-always-visible="tickerLabelAlwaysVisible ? 'true' : 'false'"
    :data-hovered-ticker="effectiveHoveredTicker ?? undefined"
    @pointerleave="handleChartLeave"
  >
    <RrgSvgRoot
      :width="width"
      :height="height"
      :title="a11yTitle"
      :description="a11yDescription"
    >
      <RrgAxes
        v-if="showAxes"
        :x-scale="xScale"
        :y-scale="yScale"
        :show-grid="showGrid"
      />
      <RrgQuadrants
        v-if="showQuadrantLabels"
        :x-scale="xScale"
        :y-scale="yScale"
      />
      <RrgTails :tail-data="tailData" :hovered-ticker="effectiveHoveredTicker" />
      <RrgPoints
        :current-points="currentPoints"
        :x-scale="xScale"
        :y-scale="yScale"
        :hovered-ticker="effectiveHoveredTicker"
        :show-patterns="showPatterns"
        @point-enter="handlePointEnter"
        @point-leave="handlePointLeave"
        @point-click="handlePointClick"
      />
      <RrgLabels :labels="resolvedLabels" :hovered-ticker="effectiveHoveredTicker" />
      <RrgTooltip
        :hovered-point="hoveredPoint"
        :x-scale="xScale"
        :y-scale="yScale"
        :plot-width="plotWidth"
        :plot-height="plotHeight"
      />
    </RrgSvgRoot>
  </div>
</template>

<style>
.rrg-chart {
  --rrg-bg: #ffffff;
  --rrg-grid: rgba(0, 0, 0, 0.08);
  --rrg-axis: rgba(0, 0, 0, 0.3);
  --rrg-center-line: rgba(0, 0, 0, 0.25);
  --rrg-axis-label: rgba(0, 0, 0, 0.5);
  --rrg-quadrant-label: rgba(0, 0, 0, 0.15);
  --rrg-label: #222;
  --rrg-muted-label: #888;
  --rrg-point-stroke: #fff;
  --rrg-tooltip-bg: rgba(255, 255, 255, 0.95);
  width: 100%;
  color: var(--rrg-label);
  font-family: ui-sans-serif, system-ui, sans-serif;
}

.rrg-chart.dark,
.dark .rrg-chart {
  --rrg-bg: #1a1a2e;
  --rrg-grid: rgba(255, 255, 255, 0.08);
  --rrg-axis: rgba(255, 255, 255, 0.3);
  --rrg-center-line: rgba(255, 255, 255, 0.25);
  --rrg-axis-label: rgba(255, 255, 255, 0.5);
  --rrg-quadrant-label: rgba(255, 255, 255, 0.12);
  --rrg-label: #eee;
  --rrg-muted-label: #aaa;
  --rrg-point-stroke: #1a1a2e;
  --rrg-tooltip-bg: rgba(20, 20, 30, 0.95);
}
</style>
