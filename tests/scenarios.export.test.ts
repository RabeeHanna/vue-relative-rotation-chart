import { describe, expect, it } from 'vitest'
import {
  denseCluster,
  defaultScenario,
  scenarioFixtures,
  type ScenarioFixtureId,
} from '../src/scenarios'

describe('scenarios public subpath', () => {
  it('exports named fixtures matching scenario ids', () => {
    expect(denseCluster.length).toBe(16)
    expect(defaultScenario.length).toBeGreaterThanOrEqual(5)
    expect(scenarioFixtures.denseCluster).toBe(denseCluster)
    expect(scenarioFixtures.default).toBe(defaultScenario)
  })

  it('covers every catalog fixture id used by the demo', () => {
    const ids: ScenarioFixtureId[] = [
      'default',
      'denseCluster',
      'farRightOutlier',
      'farLeftOutlier',
      'manyOverlapping',
      'noisyTail',
      'singleTicker',
      'stress',
      'missingLabel',
      'longLabel',
      'quadrantTour',
      'rotationCycle',
      'emptyOrSparse',
      'mixedVisibility',
      'longPlayback50',
      'longPlayback100',
      'longPlayback200',
      'longPlayback500',
    ]
    for (const id of ids) {
      expect(Array.isArray(scenarioFixtures[id])).toBe(true)
      expect(scenarioFixtures[id].length).toBeGreaterThan(0)
    }
  })
})
