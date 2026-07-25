import { describe, expect, it } from 'vitest'
import { buildCopySnippet } from '../demo/copySnippet'

describe('buildCopySnippet', () => {
  it('always references series as a variable and never inlines an array', () => {
    const snippet = buildCopySnippet({
      selectedDate: '2024-01-19',
      viewportMode: 'fit',
      labelMode: 'auto',
      tailLength: 8,
      source: 'preset',
      scenarioId: 'denseCluster',
    })

    expect(snippet).toContain(':series="series"')
    expect(snippet).not.toMatch(/:series="\s*\[/)
    expect(snippet).not.toContain('// ...')
    expect(snippet).toContain('viewport-mode="fit"')
    expect(snippet).toContain('label-mode="auto"')
    expect(snippet).toContain(':tail-length="8"')
  })

  it('includes scenarios subpath import for preset mode', () => {
    const snippet = buildCopySnippet({
      selectedDate: '2024-01-19',
      viewportMode: 'center',
      labelMode: 'hover',
      tailLength: 10,
      source: 'preset',
      scenarioId: 'farRightOutlier',
    })

    expect(snippet).toContain(
      "import { farRightOutlier as series } from 'vue-relative-rotation-chart/scenarios'",
    )
  })

  it('maps default scenario id to defaultScenario export', () => {
    const snippet = buildCopySnippet({
      selectedDate: '2024-01-19',
      viewportMode: 'fit',
      labelMode: 'auto',
      tailLength: 8,
      source: 'preset',
      scenarioId: 'default',
    })

    expect(snippet).toContain(
      "import { defaultScenario as series } from 'vue-relative-rotation-chart/scenarios'",
    )
  })

  it('omits data import comments for custom source', () => {
    const snippet = buildCopySnippet({
      selectedDate: '2024-01-19',
      viewportMode: 'fit',
      labelMode: 'auto',
      tailLength: 8,
      source: 'custom',
    })

    expect(snippet).toContain('// series from your pasted JSON')
    expect(snippet).not.toContain('Fixture:')
  })
})
