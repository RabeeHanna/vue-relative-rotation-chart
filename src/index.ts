export { default as RrgChart } from './components/RrgChart.vue'
export { default as RrgPlaybackControls } from './components/RrgPlaybackControls.vue'
export { default as RrgViewportControls } from './components/RrgViewportControls.vue'
export { default as RrgSeriesVisibilityControls } from './components/RrgSeriesVisibilityControls.vue'

export type {
  RrgRenderPoint,
  RrgRenderSeries,
  RrgSeriesPoint,
  RrgChartInput,
  RrgChartProps,
  RrgChartEmits,
  RrgChartCopy,
  RrgPlaybackCopy,
  RrgPlaybackControlsProps,
  RrgPlaybackControlsEmits,
  RrgPlaybackSpeedMode,
  RrgPlaybackLabelStyle,
  RrgQuadrant,
  RrgViewportMode,
  RrgLabelMode,
} from './types/rrg'

export type { ChartDateStatus, ResolvedChartDate } from './utils/chartDate'
export { collectSeriesDates, resolveChartDate } from './utils/chartDate'

export { RRG_CHART_DEFAULTS, RRG_PLAYBACK_DEFAULTS } from './types/rrg'
export {
  RRG_CHART_COPY_DEFAULTS,
  RRG_PLAYBACK_COPY_DEFAULTS,
  mergeChartCopy,
  mergePlaybackCopy,
  formatCopy,
} from './types/copy'
export {
  RRG_VIEWPORT_MODES,
  isRrgViewportMode,
  normalizeRrgViewportMode,
  rrgViewportModeDescription,
  rrgViewportModeLabel,
} from './utils/viewportLabels'
export {
  applyVisibleTickers,
  filterVisibleTickers,
  hideAllTickers,
  seriesTickers,
  showAllTickers,
  soloTicker,
} from './composables/useRrgSeriesVisibility'
