import { describe, expect, it } from 'vitest'
import { parseDemoUrl, serializeDemoUrl } from '../demo/demoUrl'
import {
  scenarioCatalog,
  scenarioById,
  type ScenarioId,
} from '../demo/scenarios'
import { emptyOrSparseMock, mixedVisibilityMock, quadrantTourMock, rotationCycleMock } from '../demo/scenarios'

const CATALOG_IDS: ScenarioId[] = [
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
]

describe('scenario registry', () => {
  it('resolves every catalog ID with metadata', () => {
    expect(scenarioCatalog.map((s) => s.id).sort()).toEqual([...CATALOG_IDS].sort())
    for (const id of CATALOG_IDS) {
      const meta = scenarioById[id]
      expect(meta.displayName).toBeTruthy()
      expect(meta.intent).toBeTruthy()
      expect(meta.check).toBeTruthy()
      expect(meta.suggestedViewport).toMatch(/fit|max|center/)
      expect(meta.suggestedLabelMode).toMatch(/auto|always|hover/)
      expect(Array.isArray(meta.series)).toBe(true)
    }
  })

  it('ships new C13 fixtures', () => {
    expect(quadrantTourMock).toHaveLength(4)
    expect(rotationCycleMock[0].points.length).toBeGreaterThan(4)
    expect(emptyOrSparseMock[0].points).toHaveLength(1)
    expect(mixedVisibilityMock.filter((s) => s.visible === false)).toHaveLength(2)
  })
})

describe('demo URL round-trip', () => {
  it('round-trips Tier 1 knobs', () => {
    const state = parseDemoUrl(
      'scenario=stress&viewportMode=center&labelMode=hover&theme=dark&tailLength=12&showPatterns=true&tickerLabelAlwaysVisible=true&size=wide&compare=true&viewportLeft=fit&viewportRight=max&source=preset',
    )
    expect(state.scenario).toBe('stress')
    expect(state.viewportMode).toBe('center')
    expect(state.labelMode).toBe('hover')
    expect(state.theme).toBe('dark')
    expect(state.tailLength).toBe(12)
    expect(state.showPatterns).toBe(true)
    expect(state.tickerLabelAlwaysVisible).toBe(true)
    expect(state.size).toBe('wide')
    expect(state.compare).toBe(true)
    expect(state.viewportLeft).toBe('fit')
    expect(state.viewportRight).toBe('max')

    const again = parseDemoUrl(serializeDemoUrl(state))
    expect(again).toEqual(state)
  })

  it('defaults compare panes to Fit | Center', () => {
    const state = parseDemoUrl('')
    expect(state.viewportLeft).toBe('fit')
    expect(state.viewportRight).toBe('center')
    expect(state.compare).toBe(false)
  })
})
