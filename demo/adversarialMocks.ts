/**
 * Backward-compat re-exports for C11 tests and older imports.
 * Prefer `demo/scenarios.ts` for new code.
 */
export {
  adversarialScenarios,
  datesForSeries,
  denseClusterMock,
  farLeftOutlierMock,
  farRightOutlierMock,
  longLabelMock,
  manyOverlappingMock,
  missingLabelMock,
  noisyTailMock,
  singleTickerMock,
  stressMock,
  type AdversarialScenario,
  defaultSectorMock,
  mockDates,
  mockSelectedDate,
} from './scenarios'
