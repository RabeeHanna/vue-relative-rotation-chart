import type { RrgRenderSeries } from '../types/rrg'
import {
  denseCluster,
  farLeftOutlier,
  farRightOutlier,
  manyOverlapping,
} from './clusters'
import {
  longLabel,
  missingLabel,
  noisyTail,
  singleTicker,
  stress,
} from './edges'
import {
  LONG_PLAYBACK_LENGTHS,
  longPlayback100Mock,
  longPlayback200Mock,
  longPlayback50Mock,
  longPlayback500Mock,
  makeLongPlaybackSeries,
  weeklyDates,
  type LongPlaybackLength,
} from './longPlayback'
import { mockDates, mockSelectedDate, mockSeries } from './mockSeries'
import { quadrantTour, rotationCycle } from './tours'
import { emptyOrSparse, mixedVisibility } from './visibility'

/** Named export for the `default` scenario id (`default` is reserved). */
export const defaultScenario = mockSeries

export {
  denseCluster,
  emptyOrSparse,
  farLeftOutlier,
  farRightOutlier,
  longLabel,
  manyOverlapping,
  missingLabel,
  mixedVisibility,
  noisyTail,
  quadrantTour,
  rotationCycle,
  singleTicker,
  stress,
  mockSeries,
  mockDates,
  mockSelectedDate,
  LONG_PLAYBACK_LENGTHS,
  makeLongPlaybackSeries,
  weeklyDates,
  longPlayback50Mock as longPlayback50,
  longPlayback100Mock as longPlayback100,
  longPlayback200Mock as longPlayback200,
  longPlayback500Mock as longPlayback500,
}

export type { LongPlaybackLength }

/** All published fixture series keyed by demo scenario id. */
export const scenarioFixtures = {
  default: mockSeries,
  denseCluster,
  farRightOutlier,
  farLeftOutlier,
  manyOverlapping,
  noisyTail,
  singleTicker,
  stress,
  missingLabel,
  longLabel,
  quadrantTour,
  rotationCycle,
  emptyOrSparse,
  mixedVisibility,
  longPlayback50: longPlayback50Mock,
  longPlayback100: longPlayback100Mock,
  longPlayback200: longPlayback200Mock,
  longPlayback500: longPlayback500Mock,
} as const satisfies Record<string, RrgRenderSeries[]>

export type ScenarioFixtureId = keyof typeof scenarioFixtures
