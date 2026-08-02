import type {
  RrgLabelMode,
  RrgPlaybackLabelStyle,
  RrgPlaybackLayout,
  RrgPlaybackSpeedMode,
  RrgViewportMode,
} from './rrg'

/** Default prop values shared by the component and tests. */
export const RRG_CHART_DEFAULTS = {
  tailLength: 10,
  viewportMode: 'fit' as RrgViewportMode,
  labelMode: 'auto' as RrgLabelMode,
  showQuadrantLabels: true,
  showGrid: true,
  showAxes: true,
  tickerLabelAlwaysVisible: false,
  showTailFade: false,
  pointRadius: 5.5,
  hitRadius: 12,
} as const

/** Tail-length presets for display controls (chart default may be inserted at runtime). */
export const RRG_TAIL_LENGTH_PRESETS = [4, 8, 12, 16, 24] as const

/** Defaults for `<RrgPlaybackControls />`. */
export const RRG_PLAYBACK_DEFAULTS = {
  playing: false,
  speed: 2,
  minSpeed: 0.5,
  maxSpeed: 5,
  loop: true,
  speedMode: 'interval' as RrgPlaybackSpeedMode,
  labelStyle: 'icon' as RrgPlaybackLabelStyle,
  layout: 'auto' as RrgPlaybackLayout,
} as const
