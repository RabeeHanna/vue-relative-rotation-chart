<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
import { RRG_CHART_DEFAULTS, type RrgChartProps, type RrgRenderPoint } from '../types/rrg'
import { useRrgChartEmptyState, useRrgChartExport } from '../composables/useRrgChartChrome'
import { useRrgViewport } from '../composables/useRrgViewport'
import { useRrgScales } from '../composables/useRrgScales'
import { useRrgTailSlices } from '../composables/useRrgTailSlices'
import { useRrgLabelLayout } from '../composables/useRrgLabelLayout'
import { useRrgHoverState } from '../composables/useRrgHoverState'
import { useRrgChartSummary } from '../composables/useRrgChartSummary'
import { useRrgChartPointer } from '../composables/useRrgChartPointer'
import { useRrgChartDimensions } from '../composables/useRrgChartDimensions'
import { useSeriesIndex } from '../composables/useSeriesIndex'
import { applyVisibleTickers } from '../composables/useRrgSeriesVisibility'
import { assignSeriesColors } from '../utils/colors'
import { resolveChartFormatters } from '../utils/chartFormatters'
import { mergeChartCopy } from '../types/copy'
import { resolveChartDateFromIndex } from '../utils/chartDate'
import RrgSvgRoot from './RrgSvgRoot.vue'
import RrgAxes from './RrgAxes.vue'
import RrgQuadrants from './RrgQuadrants.vue'
import RrgPoints from './RrgPoints.vue'
import RrgLabels from './RrgLabels.vue'
import RrgTails from './RrgTails.vue'
import RrgTooltip from './RrgTooltip.vue'
import './RrgChart.css'

const props = withDefaults(defineProps<Omit<RrgChartProps, 'visibleTickers'>>(), {
  tailLength: RRG_CHART_DEFAULTS.tailLength,
  viewportMode: RRG_CHART_DEFAULTS.viewportMode,
  labelMode: RRG_CHART_DEFAULTS.labelMode,
  showQuadrantLabels: RRG_CHART_DEFAULTS.showQuadrantLabels,
  showGrid: RRG_CHART_DEFAULTS.showGrid,
  showAxes: RRG_CHART_DEFAULTS.showAxes,
  tickerLabelAlwaysVisible: RRG_CHART_DEFAULTS.tickerLabelAlwaysVisible,
  showTailFade: RRG_CHART_DEFAULTS.showTailFade,
  pointRadius: RRG_CHART_DEFAULTS.pointRadius,
  hitRadius: RRG_CHART_DEFAULTS.hitRadius,
  highlightedTicker: null,
  selectedTicker: null,
})

const visibleTickers = defineModel<string[]>('visibleTickers')

const emit = defineEmits<{
  pointHover: [point: RrgRenderPoint]
  pointLeave: []
  pointClick: [point: RrgRenderPoint]
}>()

const displaySeries = computed(() => {
  if (visibleTickers.value === undefined) return props.series
  return applyVisibleTickers(props.series, visibleTickers.value)
})

const coloredSeries = computed(() => assignSeriesColors(displaySeries.value))
const seriesIndex = useSeriesIndex(coloredSeries)
const dateResolution = computed(() =>
  resolveChartDateFromIndex(seriesIndex.value, props.selectedDate),
)
const resolvedDate = computed(() => dateResolution.value.date)
const dateStatus = computed(() => dateResolution.value.status)
const chartRoot = ref<HTMLElement | null>(null)
const copyRef = toRef(props, 'copy')
const resolvedCopy = computed(() => mergeChartCopy(copyRef.value))
const resolvedFormatters = computed(() => resolveChartFormatters(props.formatters))
const { isEmpty, emptyReason, emptyMessage } = useRrgChartEmptyState(
  coloredSeries,
  dateStatus,
  resolvedCopy,
)
const { getSvgElement, exportPng } = useRrgChartExport(chartRoot)
defineExpose({ getSvgElement, exportPng })

const resolvedDateRef = resolvedDate
const tailLengthRef = toRef(props, 'tailLength')
const viewportModeRef = toRef(props, 'viewportMode')
const showTailFadeRef = toRef(props, 'showTailFade')
const domain = useRrgViewport(seriesIndex, resolvedDateRef, tailLengthRef, viewportModeRef)
const { svgWidth, svgHeight, plotWidth, plotHeight } = useRrgChartDimensions(
  chartRoot,
  toRef(props, 'width'),
  toRef(props, 'height'),
)
const { xScale, yScale } = useRrgScales(domain, plotWidth, plotHeight)
const { currentPoints, tailData } = useRrgTailSlices(
  seriesIndex,
  resolvedDateRef,
  tailLengthRef,
  xScale,
  yScale,
  showTailFadeRef,
)
const { hoveredTicker, hoveredPoint, onPointEnter, onPointLeave, onPointClick } =
  useRrgHoverState(currentPoints)
const effectiveHoveredTicker = computed(
  () => hoveredTicker.value ?? props.highlightedTicker ?? null,
)
const { title: a11yTitle, description: a11yDescription } = useRrgChartSummary(
  resolvedDateRef,
  viewportModeRef,
  currentPoints,
  copyRef,
)
const {
  handlePointEnter,
  handlePointLeave,
  handleTailEnter,
  handleTailLeave,
  handlePointClick,
  handleChartLeave,
} = useRrgChartPointer(currentPoints, { onPointEnter, onPointLeave, onPointClick }, (p) =>
  emit('pointClick', p),
)

watch(hoveredPoint, (point) => {
  if (point) emit('pointHover', point)
  else emit('pointLeave')
})

const resolvedLabels = useRrgLabelLayout(
  currentPoints,
  toRef(props, 'labelMode'),
  xScale,
  yScale,
  {
    tickerLabelAlwaysVisible: toRef(props, 'tickerLabelAlwaysVisible'),
    hoveredTicker: effectiveHoveredTicker,
  },
)
</script>

<template>
  <div
    ref="chartRoot"
    class="rrg-chart"
    data-testid="rrg-chart"
    :data-viewport-mode="viewportMode"
    :data-selected-date="resolvedDate || undefined"
    :data-date-status="dateStatus"
    :data-ticker-label-always-visible="tickerLabelAlwaysVisible ? 'true' : 'false'"
    :data-show-tail-fade="showTailFade ? 'true' : 'false'"
    :data-hovered-ticker="effectiveHoveredTicker ?? undefined"
    @pointerleave="handleChartLeave"
  >
    <div
      v-if="isEmpty"
      class="rrg-chart__empty"
      data-testid="rrg-chart-empty"
      :data-empty-reason="emptyReason"
      role="status"
    >
      {{ emptyMessage }}
    </div>
    <RrgSvgRoot
      v-else
      :width="svgWidth"
      :height="svgHeight"
      :plot-width="plotWidth"
      :plot-height="plotHeight"
      :title="a11yTitle"
      :description="a11yDescription"
    >
      <RrgAxes
        v-if="showAxes"
        :x-scale="xScale"
        :y-scale="yScale"
        :show-grid="showGrid"
        :copy="resolvedCopy"
        :formatters="resolvedFormatters"
      />
      <RrgQuadrants
        v-if="showQuadrantLabels"
        :x-scale="xScale"
        :y-scale="yScale"
        :copy="resolvedCopy"
      />
      <template #series>
        <RrgTails
          :tail-data="tailData"
          :hovered-ticker="effectiveHoveredTicker"
          :show-tail-fade="showTailFade"
          @tail-enter="handleTailEnter"
          @tail-leave="handleTailLeave"
        />
        <RrgPoints
          :current-points="currentPoints"
          :x-scale="xScale"
          :y-scale="yScale"
          :hovered-ticker="effectiveHoveredTicker"
          :selected-ticker="selectedTicker"
          :point-radius="pointRadius"
          :hit-radius="hitRadius"
          :copy="resolvedCopy"
          :formatters="resolvedFormatters"
          @point-enter="handlePointEnter"
          @point-leave="handlePointLeave"
          @point-click="handlePointClick"
        />
        <RrgLabels :labels="resolvedLabels" :hovered-ticker="effectiveHoveredTicker" />
      </template>
      <RrgTooltip
        :hovered-point="hoveredPoint"
        :x-scale="xScale"
        :y-scale="yScale"
        :plot-width="plotWidth"
        :plot-height="plotHeight"
        :copy="resolvedCopy"
        :formatters="resolvedFormatters"
      />
    </RrgSvgRoot>
  </div>
</template>
