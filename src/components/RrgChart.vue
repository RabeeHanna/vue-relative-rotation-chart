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
import './RrgChart.css'

const props = withDefaults(defineProps<RrgChartProps>(), {
  tailLength: RRG_CHART_DEFAULTS.tailLength,
  viewportMode: RRG_CHART_DEFAULTS.viewportMode,
  labelMode: RRG_CHART_DEFAULTS.labelMode,
  showQuadrantLabels: RRG_CHART_DEFAULTS.showQuadrantLabels,
  showGrid: RRG_CHART_DEFAULTS.showGrid,
  showAxes: RRG_CHART_DEFAULTS.showAxes,
  showPatterns: RRG_CHART_DEFAULTS.showPatterns,
  tickerLabelAlwaysVisible: RRG_CHART_DEFAULTS.tickerLabelAlwaysVisible,
  showTailFade: RRG_CHART_DEFAULTS.showTailFade,
  pointRadius: RRG_CHART_DEFAULTS.pointRadius,
  hitRadius: RRG_CHART_DEFAULTS.hitRadius,
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
const showTailFadeRef = toRef(props, 'showTailFade')
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
  showTailFadeRef,
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
    :data-show-tail-fade="showTailFade ? 'true' : 'false'"
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
        :selected-ticker="selectedTicker"
        :point-radius="pointRadius"
        :hit-radius="hitRadius"
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
