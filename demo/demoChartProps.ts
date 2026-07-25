import type { RrgLabelMode, RrgRenderSeries, RrgViewportMode } from '../src/types/rrg'
import type { ChartSizePreset } from './demoUrl'
import { CHART_SIZE_PX } from './demoUrl'

export function demoCurrentPoints(series: RrgRenderSeries[], selectedDate: string) {
  return series
    .filter((s) => s.visible !== false)
    .flatMap((s) => {
      const p = s.points.find((pt) => pt.date === selectedDate)
      if (!p) return []
      return [{ ticker: s.ticker, label: s.label, name: s.name, color: s.color, ...p }]
    })
}

export function demoChartProps(input: {
  series: RrgRenderSeries[]
  selectedDate: string
  labelMode: RrgLabelMode
  viewportMode: RrgViewportMode
  tailLength: number
  showPatterns: boolean
  tickerLabelAlwaysVisible: boolean
  showTailFade: boolean
  showQuadrantLabels: boolean
  showGrid: boolean
  showAxes: boolean
  highlightedTicker: string
  selectedTicker: string
  pointRadius: number
  hitRadius: number
  size: ChartSizePreset
}) {
  const { width, height } = CHART_SIZE_PX[input.size]
  return {
    series: input.series,
    selectedDate: input.selectedDate,
    labelMode: input.labelMode,
    viewportMode: input.viewportMode,
    tailLength: input.tailLength,
    showPatterns: input.showPatterns,
    tickerLabelAlwaysVisible: input.tickerLabelAlwaysVisible,
    showTailFade: input.showTailFade,
    showQuadrantLabels: input.showQuadrantLabels,
    showGrid: input.showGrid,
    showAxes: input.showAxes,
    highlightedTicker: input.highlightedTicker || null,
    selectedTicker: input.selectedTicker || null,
    pointRadius: input.pointRadius,
    hitRadius: input.hitRadius,
    width,
    height,
  }
}

export function demoChartPropsFromControls(
  controls: {
    labelMode: RrgLabelMode
    tailLength: number
    showPatterns: boolean
    tickerLabelAlwaysVisible: boolean
    showTailFade: boolean
    showQuadrantLabels: boolean
    showGrid: boolean
    showAxes: boolean
    highlightedTicker: string
    selectedTicker: string
    pointRadius: number
    hitRadius: number
    size: ChartSizePreset
  },
  series: RrgRenderSeries[],
  selectedDate: string,
  viewportMode: RrgViewportMode,
) {
  return demoChartProps({ ...controls, series, selectedDate, viewportMode })
}
