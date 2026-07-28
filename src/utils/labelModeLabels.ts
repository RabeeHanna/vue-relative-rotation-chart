import type { RrgLabelMode } from '../types/rrg'

export const RRG_LABEL_MODES: readonly RrgLabelMode[] = ['auto', 'always', 'hover']

export function isRrgLabelMode(value: string): value is RrgLabelMode {
  return (RRG_LABEL_MODES as readonly string[]).includes(value)
}

export function rrgLabelModeLabel(mode: RrgLabelMode): string {
  return mode
}

export function rrgLabelModeDescription(mode: RrgLabelMode): string {
  switch (mode) {
    case 'auto':
      return 'Spatial layout hides overlapping labels'
    case 'always':
      return 'Show every ticker label'
    case 'hover':
      return 'Labels appear on hover only'
    default:
      return mode
  }
}
