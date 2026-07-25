<script setup lang="ts">
import { computed, toRef } from 'vue'
import { RRG_CHART_DEFAULTS, type RrgChartProps } from '../types/rrg'
import { useRrgViewport } from '../composables/useRrgViewport'
import { useRrgScales } from '../composables/useRrgScales'
import { useRrgTailSlices } from '../composables/useRrgTailSlices'
import { useRrgLabelLayout } from '../composables/useRrgLabelLayout'
import { assignSeriesColors } from '../utils/colors'
import { RRG_DEFAULT_MARGIN } from '../utils/chartLayout'
import RrgSvgRoot from './RrgSvgRoot.vue'
import RrgAxes from './RrgAxes.vue'
import RrgQuadrants from './RrgQuadrants.vue'
import RrgPoints from './RrgPoints.vue'
import RrgLabels from './RrgLabels.vue'
import RrgTails from './RrgTails.vue'

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

defineEmits<{
  pointHover: [point: import('../types/rrg').RrgRenderPoint]
  pointLeave: []
  pointClick: [point: import('../types/rrg').RrgRenderPoint]
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

const labelModeRef = toRef(props, 'labelMode')
const alwaysVisibleRef = toRef(props, 'tickerLabelAlwaysVisible')
const resolvedLabels = useRrgLabelLayout(
  currentPoints,
  labelModeRef,
  xScale,
  yScale,
  { tickerLabelAlwaysVisible: alwaysVisibleRef },
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
  >
    <RrgSvgRoot :width="width" :height="height">
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
      <RrgTails :tail-data="tailData" :hovered-ticker="highlightedTicker" />
      <RrgPoints
        :current-points="currentPoints"
        :x-scale="xScale"
        :y-scale="yScale"
      />
      <RrgLabels :labels="resolvedLabels" />
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
  --rrg-tooltip-bg: #fff;
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
  --rrg-tooltip-bg: #222;
}
</style>
