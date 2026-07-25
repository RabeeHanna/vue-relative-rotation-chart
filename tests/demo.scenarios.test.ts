import { describe, expect, it } from 'vitest'
import { parseDemoUrl, serializeDemoUrl } from '../demo/demoUrl'
import {
  scenarioCatalog,
  scenarioById,
  datesForSeries,
  type ScenarioId,
  emptyOrSparseMock,
  mixedVisibilityMock,
  quadrantTourMock,
  rotationCycleMock,
} from '../demo/scenarios'

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
  'longPlayback50',
  'longPlayback100',
  'longPlayback200',
  'longPlayback500',
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
    expect(rotationCycleMock[0].points.length).toBeGreaterThan(10)
    expect(emptyOrSparseMock[0].points).toHaveLength(1)
    expect(mixedVisibilityMock.filter((s) => s.visible === false)).toHaveLength(2)
  })

  it('default sector baseline supports multi-week playback', () => {
    const dates = datesForSeries(scenarioById.default.series)
    expect(dates.length).toBeGreaterThanOrEqual(12)
    expect(scenarioById.default.series.length).toBeGreaterThanOrEqual(5)
  })
})

describe('demo URL round-trip', () => {
  it('round-trips Tier 1 knobs', () => {
    const state = parseDemoUrl(
      'scenario=stress&viewportMode=center&labelMode=hover&theme=dark&tailLength=12&showPatterns=true&tickerLabelAlwaysVisible=true&showTailFade=true&playbackLoop=true&size=wide&compare=true&viewportLeft=fit&viewportRight=max&source=preset',
    )
    expect(state.scenario).toBe('stress')
    expect(state.viewportMode).toBe('center')
    expect(state.labelMode).toBe('hover')
    expect(state.theme).toBe('dark')
    expect(state.tailLength).toBe(12)
    expect(state.showPatterns).toBe(true)
    expect(state.tickerLabelAlwaysVisible).toBe(true)
    expect(state.showTailFade).toBe(true)
    expect(state.playbackLoop).toBe(true)
    expect(state.size).toBe('wide')
    expect(state.compare).toBe(true)
    expect(state.viewportLeft).toBe('fit')
    expect(state.viewportRight).toBe('max')

    const again = parseDemoUrl(serializeDemoUrl(state))
    expect(again).toEqual(state)
  })

  it('defaults maxSpeed to 5, compare Fit|Center, and treats missing URL nums as fallbacks', () => {
    const state = parseDemoUrl('')
    expect(state.maxSpeed).toBe(5)
    expect(state.minSpeed).toBe(0.5)
    expect(state.speedMode).toBe('interval')
    expect(state.viewportLeft).toBe('fit')
    expect(state.viewportRight).toBe('center')
    expect(state.compare).toBe(false)
    expect(state.showTailFade).toBe(false)
    expect(state.playbackLoop).toBe(false)
  })
})
