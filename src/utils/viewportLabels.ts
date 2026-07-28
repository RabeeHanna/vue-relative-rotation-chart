import type { RrgViewportMode } from '../types/rrg'

export const RRG_VIEWPORT_MODES: readonly RrgViewportMode[] = ['fit', 'max', 'center']

export function isRrgViewportMode(value: string): value is RrgViewportMode {
  return (RRG_VIEWPORT_MODES as readonly string[]).includes(value)
}

export function normalizeRrgViewportMode(
  mode: string,
  fallback: RrgViewportMode = 'fit',
): RrgViewportMode {
  return isRrgViewportMode(mode) ? mode : fallback
}

export function rrgViewportModeLabel(mode: RrgViewportMode): string {
  if (mode === 'max') {
    return 'Max'
  }
  if (mode === 'center') {
    return 'Center'
  }
  return 'Fit'
}

export function rrgViewportModeDescription(mode: RrgViewportMode): string {
  if (mode === 'max') {
    return 'Full loaded range, including outlier paths'
  }
  if (mode === 'center') {
    return 'Fixed range centered around (100, 100)'
  }
  return 'Focus on visible current points and tails with reasonable padding'
}
