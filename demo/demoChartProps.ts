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

/** Longest visible series point count — used for full-history tail mode. */
export function maxSeriesPointCount(series: RrgRenderSeries[]): number {
  let max = 1
  for (const s of series) {
    if (s.visible === false) continue
    max = Math.max(max, s.points.length)
  }
  return max
}

/** Slider length, or full history when the demo toggle is on. */
export function effectiveDemoTailLength(
  tailLength: number,
  fullHistoryTail: boolean,
  series: RrgRenderSeries[],
): number {
  if (!fullHistoryTail) return Math.max(1, Math.floor(tailLength) || 1)
  return maxSeriesPointCount(series)
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
    fullHistoryTail?: boolean
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
  const tailLength = effectiveDemoTailLength(
    controls.tailLength,
    Boolean(controls.fullHistoryTail),
    series,
  )
  return demoChartProps({ ...controls, tailLength, series, selectedDate, viewportMode })
}
