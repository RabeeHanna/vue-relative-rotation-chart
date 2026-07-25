import type { RrgLabelMode, RrgRenderSeries, RrgViewportMode } from '../src/types/rrg'
import {
  denseCluster,
  emptyOrSparse,
  farLeftOutlier,
  farRightOutlier,
  longLabel,
  longPlayback100,
  longPlayback200,
  longPlayback50,
  longPlayback500,
  manyOverlapping,
  missingLabel,
  mixedVisibility,
  mockSeries as defaultSectorMock,
  noisyTail,
  quadrantTour,
  rotationCycle,
  singleTicker,
  stress,
} from '../src/scenarios'

export {
  defaultScenario,
  denseCluster,
  emptyOrSparse,
  farLeftOutlier,
  farRightOutlier,
  longLabel,
  longPlayback100,
  longPlayback200,
  longPlayback50,
  longPlayback500,
  LONG_PLAYBACK_LENGTHS,
  makeLongPlaybackSeries,
  manyOverlapping,
  missingLabel,
  mixedVisibility,
  mockDates,
  mockSelectedDate,
  mockSeries,
  noisyTail,
  quadrantTour,
  rotationCycle,
  scenarioFixtures,
  singleTicker,
  stress,
  weeklyDates,
} from '../src/scenarios'

export { mockSeries as defaultSectorMock } from '../src/scenarios'

/** @deprecated Prefer `denseCluster` from `vue-relative-rotation-chart/scenarios`. */
export const denseClusterMock = denseCluster
/** @deprecated Prefer `farRightOutlier` from scenarios subpath. */
export const farRightOutlierMock = farRightOutlier
/** @deprecated Prefer `farLeftOutlier` from scenarios subpath. */
export const farLeftOutlierMock = farLeftOutlier
/** @deprecated Prefer `manyOverlapping` from scenarios subpath. */
export const manyOverlappingMock = manyOverlapping
/** @deprecated Prefer `noisyTail` from scenarios subpath. */
export const noisyTailMock = noisyTail
/** @deprecated Prefer `singleTicker` from scenarios subpath. */
export const singleTickerMock = singleTicker
/** @deprecated Prefer `stress` from scenarios subpath. */
export const stressMock = stress
/** @deprecated Prefer `missingLabel` from scenarios subpath. */
export const missingLabelMock = missingLabel
/** @deprecated Prefer `longLabel` from scenarios subpath. */
export const longLabelMock = longLabel
/** @deprecated Prefer `quadrantTour` from scenarios subpath. */
export const quadrantTourMock = quadrantTour
/** @deprecated Prefer `rotationCycle` from scenarios subpath. */
export const rotationCycleMock = rotationCycle
/** @deprecated Prefer `emptyOrSparse` from scenarios subpath. */
export const emptyOrSparseMock = emptyOrSparse
/** @deprecated Prefer `mixedVisibility` from scenarios subpath. */
export const mixedVisibilityMock = mixedVisibility
/** @deprecated Prefer `longPlayback50` from scenarios subpath. */
export const longPlayback50Mock = longPlayback50
/** @deprecated Prefer `longPlayback100` from scenarios subpath. */
export const longPlayback100Mock = longPlayback100
/** @deprecated Prefer `longPlayback200` from scenarios subpath. */
export const longPlayback200Mock = longPlayback200
/** @deprecated Prefer `longPlayback500` from scenarios subpath. */
export const longPlayback500Mock = longPlayback500

export type ScenarioId =
  | 'default'
  | 'denseCluster'
  | 'farRightOutlier'
  | 'farLeftOutlier'
  | 'manyOverlapping'
  | 'noisyTail'
  | 'singleTicker'
  | 'stress'
  | 'missingLabel'
  | 'longLabel'
  | 'quadrantTour'
  | 'rotationCycle'
  | 'emptyOrSparse'
  | 'mixedVisibility'
  | 'longPlayback50'
  | 'longPlayback100'
  | 'longPlayback200'
  | 'longPlayback500'

export type ScenarioMeta = {
  id: ScenarioId
  displayName: string
  intent: string
  check: string
  suggestedViewport: RrgViewportMode
  suggestedLabelMode: RrgLabelMode
  series: RrgRenderSeries[]
}

export const scenarioCatalog: ScenarioMeta[] = [
  {
    id: 'default',
    displayName: 'Sector baseline',
    intent: 'Everyday multi-ticker view with multi-week playback',
    check: 'Six sectors rotate over 16 weeks — Play shows clear motion',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: defaultSectorMock,
  },
  {
    id: 'denseCluster',
    displayName: 'Dense cluster',
    intent: 'Label collision under auto',
    check: 'Labels stay non-fusing near 100/100',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: denseCluster,
  },
  {
    id: 'farRightOutlier',
    displayName: 'Far-right outlier',
    intent: 'Fit-All vs center/max',
    check: 'OUT is in frame under fit; compare with center',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: farRightOutlier,
  },
  {
    id: 'farLeftOutlier',
    displayName: 'Far-left outlier',
    intent: 'Fit-All opposite side',
    check: 'OUT visible under fit on the left',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: farLeftOutlier,
  },
  {
    id: 'manyOverlapping',
    displayName: 'Coincident pairs',
    intent: 'Stacked hit targets',
    check: 'Hover still resolves a ticker for each pair',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'always',
    series: manyOverlapping,
  },
  {
    id: 'noisyTail',
    displayName: 'Noisy tails',
    intent: 'Direction readability',
    check: 'Zigzag and CCW tails remain visually distinct',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: noisyTail,
  },
  {
    id: 'singleTicker',
    displayName: 'Single ticker',
    intent: 'Degenerate / sparse UI',
    check: 'SOLO point and label render alone',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: singleTicker,
  },
  {
    id: 'stress',
    displayName: 'Stress 50×30',
    intent: 'Fixed density / perf story',
    check: '50 points render; prefer labelMode=hover',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'hover',
    series: stress,
  },
  {
    id: 'missingLabel',
    displayName: 'Missing labels',
    intent: 'Tooltip still shows ticker',
    check: 'Hover NLBL tooltip contains NLBL',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: missingLabel,
  },
  {
    id: 'longLabel',
    displayName: 'Long labels',
    intent: 'Collision + width',
    check: 'NASDAQCOMP does not fuse with neighbors',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: longLabel,
  },
  {
    id: 'quadrantTour',
    displayName: 'Quadrant tour',
    intent: 'One ticker per quadrant',
    check: 'LEAD/WEAK/LAGG/IMPR sit in distinct quadrants',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'always',
    series: quadrantTour,
  },
  {
    id: 'rotationCycle',
    displayName: 'Rotation cycle',
    intent: 'Classic clockwise RRG path',
    check: 'Scrubbing CYCLE walks through all quadrants',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: rotationCycle,
  },
  {
    id: 'emptyOrSparse',
    displayName: 'Empty / sparse',
    intent: 'Graceful empty & single-date',
    check: 'SPARSE single-date frame; BYO [] for empty',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: emptyOrSparse,
  },
  {
    id: 'mixedVisibility',
    displayName: 'Mixed visibility',
    intent: 'Some visible: false',
    check: 'Only SHOW/SHOW2 points appear',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: mixedVisibility,
  },
  {
    id: 'longPlayback50',
    displayName: 'Long playback 50',
    intent: '8 tickers × 50 weeks — playback stress baseline',
    check: 'Scrub/Play through 50 frames without throw',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'hover',
    series: longPlayback50,
  },
  {
    id: 'longPlayback100',
    displayName: 'Long playback 100',
    intent: '8 tickers × 100 weeks',
    check: 'Playback remains usable; note any scrub lag',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'hover',
    series: longPlayback100,
  },
  {
    id: 'longPlayback200',
    displayName: 'Long playback 200',
    intent: '8 tickers × 200 weeks — optimization candidate',
    check: 'Mount + one scrub step; document ceiling if laggy',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'hover',
    series: longPlayback200,
  },
  {
    id: 'longPlayback500',
    displayName: 'Long playback 500',
    intent: '8 tickers × 500 weeks — upper stress',
    check: 'Mount + tail compute; expect future optimization',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'hover',
    series: longPlayback500,
  },
]

export const scenarioById = Object.fromEntries(
  scenarioCatalog.map((s) => [s.id, s]),
) as Record<ScenarioId, ScenarioMeta>

/** Flat map used by older demo / C11 tests. */
export const adversarialScenarios = Object.fromEntries(
  scenarioCatalog.map((s) => [s.id, s.series]),
) as Record<ScenarioId, RrgRenderSeries[]>

export type AdversarialScenario = ScenarioId

export function datesForSeries(series: RrgRenderSeries[]): string[] {
  const set = new Set<string>()
  for (const s of series) {
    for (const p of s.points) set.add(p.date)
  }
  return [...set].sort()
}

export function isScenarioId(value: string | null): value is ScenarioId {
  return value != null && value in scenarioById
}
