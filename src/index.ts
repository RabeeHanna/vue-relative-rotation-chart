export { default as RrgChart } from './components/RrgChart.vue'
export { default as RrgPlaybackControls } from './components/RrgPlaybackControls.vue'
export { default as RrgViewportControls } from './components/RrgViewportControls.vue'
export { default as RrgSeriesVisibilityControls } from './components/RrgSeriesVisibilityControls.vue'
export { default as RrgDisplaySettingsControls } from './components/RrgDisplaySettingsControls.vue'
export { default as RrgChartControlsPanel } from './components/RrgChartControlsPanel.vue'
export type { RrgChartControlsSection } from './components/RrgChartControlsPanel.vue'

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
  RrgPlaybackLayout,
  RrgQuadrant,
  RrgViewportMode,
  RrgLabelMode,
} from './types/rrg'

export type { ChartDateStatus, ResolvedChartDate } from './utils/chartDate'
export { collectSeriesDates, resolveChartDate } from './utils/chartDate'

export { RRG_CHART_DEFAULTS, RRG_PLAYBACK_DEFAULTS, RRG_TAIL_LENGTH_PRESETS } from './types/rrg'
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
  RRG_LABEL_MODES,
  isRrgLabelMode,
  rrgLabelModeDescription,
  rrgLabelModeLabel,
} from './utils/labelModeLabels'
export {
  applyVisibleTickers,
  filterVisibleTickers,
  hideAllTickers,
  seriesTickers,
  showAllTickers,
  soloTicker,
} from './composables/useRrgSeriesVisibility'
export {
  exportSvgElementAsPng,
  serializeSvgElement,
  svgMarkupToDataUrl,
} from './utils/exportChartSvg'
export type { ExportChartPngOptions } from './utils/exportChartSvg'
