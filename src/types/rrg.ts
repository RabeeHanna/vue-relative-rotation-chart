/**
 * Public data contract for vue-relative-rotation-chart.
 *
 * This package is a renderer only — it does not fetch data or compute
 * RS-Ratio / RS-Momentum. Callers must pass precomputed series.
 *
 * ## Input invariants (caller responsibility)
 *
 * | Invariant | Requirement |
 * |-----------|-------------|
 * | Coordinates | Finite `x` and `y` on every point |
 * | Dates | ISO `YYYY-MM-DD` strings, ascending per series (lexical sort = chronological) |
 * | Uniqueness | No duplicate dates within a series; unique `ticker` per series entry |
 * | Quadrant | Must match `x`/`y` relative to center `100`/`100` (derived internally in a future major) |
 * | `selectedDate` | Should match a date in the union of visible series dates; otherwise snaps to nearest |
 * | Dimensions | Positive `width` / `height` when explicitly provided |
 *
 * ## Sparse dates
 *
 * Each ticker trail may omit dates other series contain. At a given `selectedDate`,
 * tickers **without** a point on that date are omitted from the current frame (no
 * carry-forward / last-known-value interpolation). Supply explicit points if you need
 * a ticker visible on every global date.
 */

import type { RrgChartCopy, RrgPlaybackCopy } from './copy'

export type { RrgChartCopy, RrgPlaybackCopy } from './copy'
export { RRG_CHART_DEFAULTS, RRG_PLAYBACK_DEFAULTS, RRG_TAIL_LENGTH_PRESETS } from './defaults'

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
  /** ISO `YYYY-MM-DD` date; must be unique and ascending within the parent series. */
  date: string
  x: number
  y: number
  /** Caller-supplied; must agree with x/y vs center 100 (see module invariants). */
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
  points: readonly RrgSeriesPoint[]
  /** Assigned by the component if omitted */
  color?: string
  /** Default true; false hides from all rendering */
  visible?: boolean
}

export type RrgViewportMode = 'fit' | 'max' | 'center'

/**
 * Viewport domain policy (Policy A): `fit` and `max` modes always expand the
 * computed data extent to include the RRG center (`100` on both axes) so
 * quadrant labels and center lines match the visible region. `center` mode uses
 * a symmetric window around `100`. Hidden series (`visible: false`) are
 * excluded from `fit` and `max` domain calculation.
 */

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
  series: readonly RrgRenderSeries[]
  tailLength: number
  viewportMode: RrgViewportMode
}

/**
 * Public props for `<RrgChart />`.
 *
 * Accessibility: prefer `tickerLabelAlwaysVisible` / labels + tooltip (PRE-C1-C).
 */
export type RrgChartProps = {
  /**
   * Precomputed trails per ticker. Replace the `series` array reference (or pass a
   * new array instance) when underlying point data changes so the chart rebuilds
   * its internal date/point index. Mutating points in place without replacing
   * `series` is not supported.
   */
  series: readonly RrgRenderSeries[]
  /**
   * ISO date selecting the current frame. Exact matches render as-is; mismatches
   * snap to the nearest series date (`data-date-status="snapped"`). Empty series
   * or no dates → empty-state (`data-date-status="empty"`).
   *
   * Sparse trails: tickers without a point on the resolved date are hidden for
   * that frame (no interpolation).
   */
  selectedDate: string

  /**
   * When bound, only tickers in this list render. Share with
   * `RrgChartControlsPanel` / `RrgSeriesVisibilityControls` via
   * `v-model:visible-tickers`. When omitted, each series entry's `visible` flag applies.
   */
  visibleTickers?: string[]

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
 *
 * Auto-derived domains (`fit`, `max`) always include the RRG center (`100`)
 * on both axes; see viewport policy on {@link RrgViewportMode}.
 */
export type RrgDomain = {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}
