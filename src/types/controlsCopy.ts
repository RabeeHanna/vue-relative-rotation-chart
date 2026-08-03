/**
 * Overridable UI copy for chart control components (localization).
 */

import { omitEmpty } from './copyUtils'

export type RrgControlsCopy = {
  chartControlsGroup?: string
  viewportSection?: string
  displaySection?: string
  seriesSection?: string
  viewportGroup?: string
  displayGroup?: string
  visibilityGroup?: string
  viewportFit?: string
  viewportMax?: string
  viewportCenter?: string
  viewportFitDescription?: string
  viewportMaxDescription?: string
  viewportCenterDescription?: string
  tail?: string
  labels?: string
  tailFade?: string
  labelAuto?: string
  labelAlways?: string
  labelHover?: string
  labelAutoDescription?: string
  labelAlwaysDescription?: string
  labelHoverDescription?: string
  showAll?: string
  hideAll?: string
  restore?: string
  solo?: string
}

export type ResolvedRrgControlsCopy = Required<RrgControlsCopy>

export const RRG_CONTROLS_COPY_DEFAULTS: ResolvedRrgControlsCopy = {
  chartControlsGroup: 'Chart controls',
  viewportSection: 'Viewport',
  displaySection: 'Display',
  seriesSection: 'Series',
  viewportGroup: 'Chart viewport mode',
  displayGroup: 'Chart display settings',
  visibilityGroup: 'Series visibility',
  viewportFit: 'Fit',
  viewportMax: 'Max',
  viewportCenter: 'Center',
  viewportFitDescription: 'Focus on visible current points and tails with reasonable padding',
  viewportMaxDescription: 'Full loaded range, including outlier paths',
  viewportCenterDescription: 'Fixed range centered around (100, 100)',
  tail: 'Tail',
  labels: 'Labels',
  tailFade: 'Tail fade',
  labelAuto: 'auto',
  labelAlways: 'always',
  labelHover: 'hover',
  labelAutoDescription: 'Spatial layout hides overlapping labels',
  labelAlwaysDescription: 'Show every ticker label',
  labelHoverDescription: 'Labels appear on hover only',
  showAll: 'Show all',
  hideAll: 'Hide all',
  restore: 'Restore',
  solo: 'Solo',
}

export function mergeControlsCopy(
  partial?: RrgControlsCopy | null,
): ResolvedRrgControlsCopy {
  return { ...RRG_CONTROLS_COPY_DEFAULTS, ...omitEmpty(partial) }
}
