import type {
  RrgLabelMode,
  RrgPlaybackLabelStyle,
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

/** Defaults for `<RrgPlaybackControls />`. */
export const RRG_PLAYBACK_DEFAULTS = {
  playing: false,
  speed: 2,
  minSpeed: 0.5,
  maxSpeed: 5,
  loop: true,
  speedMode: 'interval' as RrgPlaybackSpeedMode,
  labelStyle: 'icon' as RrgPlaybackLabelStyle,
} as const
