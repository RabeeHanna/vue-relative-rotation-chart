/**
 * Public data contract for vue-relative-rotation-chart.
 *
 * This package is a renderer only — it does not fetch data or compute
 * RS-Ratio / RS-Momentum. Callers must pass precomputed series.
 */

import type { RrgChartCopy, RrgPlaybackCopy } from './copy'

export type { RrgChartCopy, RrgPlaybackCopy } from './copy'
export { RRG_CHART_DEFAULTS, RRG_PLAYBACK_DEFAULTS } from './defaults'

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
 * `selectedDate` should be an ISO date present in the series. When it does not match,
 * the chart snaps to the nearest series date (see `resolveChartDate`). Empty series
 * yields the empty-state UI rather than blank undefined rendering.
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
 * Accessibility: prefer `tickerLabelAlwaysVisible` / labels + tooltip (PRE-C1-C).
 */
export type RrgChartProps = {
  series: RrgRenderSeries[]
  /**
   * ISO date selecting the current frame. Exact matches render as-is; mismatches
   * snap to the nearest series date (`data-date-status="snapped"`). Empty series
   * or no dates → empty-state (`data-date-status="empty"`).
   */
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

  /** Current-frame point radius in SVG px (default 5.5) */
  pointRadius?: number
  /** Invisible pointer hit radius in SVG px (default 12) */
  hitRadius?: number

  /**
   * When true, override labelMode / collision hide and always show all labels.
   * Primary colorblind / monochrome identity strategy (see PRE-C1-C).
   * Default false.
   */
  tickerLabelAlwaysVisible?: boolean
  /**
   * When true, tail segments fade oldest → newest (opacity gradient).
   * When false, all segments use a uniform strong opacity. Default false.
   */
  showTailFade?: boolean

  /** Optional UI copy overrides (quadrants, tooltip, a11y title/desc). */
  copy?: RrgChartCopy
}

export type RrgChartEmits = {
  pointHover: [point: RrgRenderPoint]
  pointLeave: []
  pointClick: [point: RrgRenderPoint]
}

/**
 * Controlled timeline UI props (`RrgPlaybackControls`) — separate from chart rendering.
 */
export type RrgPlaybackSpeedMode = 'interval' | 'skip'

/** Visual labels on playback transport buttons. */
export type RrgPlaybackLabelStyle = 'icon' | 'icon-text'

/**
 * `auto`: stack when the component is ≤600px wide (container query).
 * `stacked`: force phone-style layout regardless of width.
 * `inline`: keep horizontal row even when narrow.
 */
export type RrgPlaybackLayout = 'auto' | 'stacked' | 'inline'

export type RrgPlaybackControlsProps = {
  /** Ordered ascending ISO date strings */
  dates: string[]
  /** Current frame; snapped to nearest when not in `dates` */
  selectedDate: string
  playing?: boolean
  /**
   * Playback rate multiplier (shown as `Nx`).
   * - `interval`: advance 1 frame every `1000/speed` ms (all dates visited).
   * - `skip`: tick at 1 Hz and jump `round(speed)` frames (intermediate dates skipped).
   */
  speed?: number
  minSpeed?: number
  maxSpeed?: number
  loop?: boolean
  /** Default `interval`. */
  speedMode?: RrgPlaybackSpeedMode
  /**
   * `icon` (default): glyph buttons with `aria-label` + `title`.
   * `icon-text`: glyphs plus visible `copy` strings.
   */
  labelStyle?: RrgPlaybackLabelStyle
  /** Responsive row vs stacked layout. Default `auto`. */
  layout?: RrgPlaybackLayout
  /** Optional UI copy overrides (buttons, frame label, aria). */
  copy?: RrgPlaybackCopy
}

export type RrgPlaybackControlsEmits = {
  'update:selectedDate': [date: string]
  'update:playing': [playing: boolean]
  'update:speed': [speed: number]
  'update:loop': [loop: boolean]
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
