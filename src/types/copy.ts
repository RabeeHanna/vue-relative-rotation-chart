import { omitEmpty } from './copyUtils'

/**
 * Overridable UI copy for chart + playback (localization / branding).
 * Omitted keys fall back to English defaults.
 */

export type RrgChartCopy = {
  leading?: string
  weakening?: string
  lagging?: string
  improving?: string
  rsRatio?: string
  rsMomentum?: string
  quadrant?: string
  /** SVG title; `{date}` replaced with selected date */
  chartTitle?: string
  /**
   * SVG description; supports `{date}`, `{count}`, `{viewport}`,
   * `{leading}`, `{improving}`. When set, replaces the default summary sentence set.
   */
  chartDescription?: string
  /** Empty state when every series is hidden via visibility. */
  emptyAllHidden?: string
  /** Empty state when no dates exist in the series union. */
  emptyNoDates?: string
  /** Horizontal axis title below the plot. */
  axisTitleX?: string
  /** Vertical axis title beside the plot. */
  axisTitleY?: string
}

export type RrgPlaybackCopy = {
  play?: string
  pause?: string
  stepBackward?: string
  stepForward?: string
  timeline?: string
  decreaseSpeed?: string
  increaseSpeed?: string
  loop?: string
  /** `{current}` and `{total}`; use `—` when there is no frame */
  frame?: string
  /** Root group aria-label */
  group?: string
}

export type ResolvedRrgChartCopy = Required<RrgChartCopy>
export type ResolvedRrgPlaybackCopy = Required<RrgPlaybackCopy>

export const RRG_CHART_COPY_DEFAULTS: ResolvedRrgChartCopy = {
  leading: 'Leading',
  weakening: 'Weakening',
  lagging: 'Lagging',
  improving: 'Improving',
  rsRatio: 'RS-Ratio',
  rsMomentum: 'RS-Momentum',
  quadrant: 'Quadrant',
  chartTitle: 'Relative Rotation Chart — {date}',
  chartDescription:
    'RRG chart showing {count} tickers as of {date}. Viewport mode: {viewport}. Leading quadrant: {leading}. Improving quadrant: {improving}.',
  emptyAllHidden: 'All series are hidden',
  emptyNoDates: 'No series dates to display',
  axisTitleX: 'RS-Ratio →',
  axisTitleY: 'RS-Momentum ↑',
}

export const RRG_PLAYBACK_COPY_DEFAULTS: ResolvedRrgPlaybackCopy = {
  play: 'Play',
  pause: 'Pause',
  stepBackward: 'Step backward',
  stepForward: 'Step forward',
  timeline: 'Timeline',
  decreaseSpeed: 'Decrease speed',
  increaseSpeed: 'Increase speed',
  loop: 'Loop',
  frame: 'Frame {current} of {total}',
  group: 'Playback controls. Space play pause, arrows step, Home End jump.',
}

export function mergeChartCopy(partial?: RrgChartCopy | null): ResolvedRrgChartCopy {
  return { ...RRG_CHART_COPY_DEFAULTS, ...omitEmpty(partial) }
}

export function mergePlaybackCopy(partial?: RrgPlaybackCopy | null): ResolvedRrgPlaybackCopy {
  return { ...RRG_PLAYBACK_COPY_DEFAULTS, ...omitEmpty(partial) }
}

/** Replace `{token}` placeholders; unknown tokens left unchanged. */
export function formatCopy(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{([a-zA-Z]+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  )
}
