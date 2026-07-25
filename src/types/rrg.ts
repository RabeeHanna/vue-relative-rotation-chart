/**
 * Public data contract for vue-relative-rotation-chart.
 *
 * This package is a renderer only — it does not fetch data or compute
 * RS-Ratio / RS-Momentum. Callers must pass precomputed series.
 */

/** Quadrant relative to the RRG center (x=100, y=100). */
export type RrgQuadrant = 'leading' | 'weakening' | 'lagging' | 'improving'

/**
 * A single ticker position at one moment in time (current frame point).
 */
export type RrgRenderPoint = {
  /** Symbol, e.g. "XLK" */
  ticker: string
  /** Display label, typically same as ticker */
  label: string
  /** Full name, e.g. "Technology Select Sector SPDR" */
  name?: string
  /** RS-Ratio (horizontal axis). Expected near the 100-centered RRG scale; no normalization applied. */
  x: number
  /** RS-Momentum (vertical axis). Expected near the 100-centered RRG scale; no normalization applied. */
  y: number
  /** Derived from x/y by the caller */
  quadrant: RrgQuadrant
  /**
   * ISO date for the current frame when emitted from hover/click events.
   * Optional on synthetic points; populated by the chart for interaction payloads.
   */
  date?: string
  /** Optional color override; component assigns a default if omitted */
  color?: string
}

/**
 * One historical sample inside a series trail.
 *
 * Points within a series must be sorted oldest → newest by `date`.
 * `date` must be an ISO 8601 date string (e.g. "2024-03-15").
 */
export type RrgSeriesPoint = {
  date: string
  x: number
  y: number
  quadrant: RrgQuadrant
}

/**
 * Full historical trail for one ticker.
 */
export type RrgRenderSeries = {
  ticker: string
  label: string
  name?: string
  /** Full history, sorted oldest → newest by date */
  points: RrgSeriesPoint[]
  /** Assigned by the component if omitted */
  color?: string
  /** Default true; false hides from all rendering */
  visible?: boolean
}

export type RrgViewportMode = 'fit' | 'max' | 'center'

export type RrgLabelMode = 'auto' | 'always' | 'hover'

/**
 * Convenience input shape matching chart props for adapters.
 *
 * `selectedDate` must exactly match one of the `date` strings in the series points.
 * The component does not validate or transform input — malformed input yields undefined rendering.
 */
export type RrgChartInput = {
  selectedDate: string
  series: RrgRenderSeries[]
  tailLength: number
  viewportMode: RrgViewportMode
}

/**
 * Public props for `<RrgChart />`.
 *
 * Accessibility props (`showPatterns`, `tickerLabelAlwaysVisible`) are defined in PRE-C1-C.
 */
export type RrgChartProps = {
  series: RrgRenderSeries[]
  /** ISO date string selecting the current frame; must match a series point date */
  selectedDate: string

  /** How many historical points to show as tail (default: 10) */
  tailLength?: number
  /** Default: 'fit' (Fit-All — data extent + padding; see PRE-C1-B) */
  viewportMode?: RrgViewportMode
  /** Default: 'auto' */
  labelMode?: RrgLabelMode
  showQuadrantLabels?: boolean
  showGrid?: boolean
  showAxes?: boolean

  highlightedTicker?: string | null
  selectedTicker?: string | null

  width?: number
  height?: number

  /**
   * When true, render hatch/stripe SVG patterns on points in addition to color.
   * Default false. Rendering implemented in C9.
   */
  showPatterns?: boolean
  /**
   * When true, override labelMode / collision hide and always show all labels.
   * Default false.
   */
  tickerLabelAlwaysVisible?: boolean
}

export type RrgChartEmits = {
  pointHover: [point: RrgRenderPoint]
  pointLeave: []
  pointClick: [point: RrgRenderPoint]
}

/**
 * Controlled timeline UI props (`RrgPlaybackControls`) — separate from chart rendering.
 */
export type RrgPlaybackControlsProps = {
  /** Ordered ascending ISO date strings */
  dates: string[]
  /** Current frame; snapped to nearest when not in `dates` */
  selectedDate: string
  playing?: boolean
  /** Frames per second */
  speed?: number
  minSpeed?: number
  maxSpeed?: number
  loop?: boolean
}

export type RrgPlaybackControlsEmits = {
  'update:selectedDate': [date: string]
  'update:playing': [playing: boolean]
  'update:speed': [speed: number]
}

/**
 * Computed viewport domain in data space (internal; not part of the caller input contract).
 */
export type RrgDomain = {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

/** Default prop values shared by the component and tests. */
export const RRG_CHART_DEFAULTS = {
  tailLength: 10,
  viewportMode: 'fit' as RrgViewportMode,
  labelMode: 'auto' as RrgLabelMode,
  showQuadrantLabels: true,
  showGrid: true,
  showAxes: true,
  showPatterns: false,
  tickerLabelAlwaysVisible: false,
} as const

/** Defaults for `<RrgPlaybackControls />`. */
export const RRG_PLAYBACK_DEFAULTS = {
  playing: false,
  speed: 2,
  minSpeed: 0.5,
  maxSpeed: 8,
  loop: true,
} as const
