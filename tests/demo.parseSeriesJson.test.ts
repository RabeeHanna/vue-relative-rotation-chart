import { describe, expect, it } from 'vitest'
import { parseSeriesJson } from '../demo/parseSeriesJson'

const valid = JSON.stringify([
  {
    ticker: 'XLK',
    label: 'XLK',
    points: [{ date: '2024-01-05', x: 104, y: 102, quadrant: 'leading' }],
  },
])

describe('parseSeriesJson', () => {
  it('accepts valid RrgRenderSeries JSON including empty array', () => {
    expect(parseSeriesJson(valid)).toEqual({
      ok: true,
      series: JSON.parse(valid),
    })
    expect(parseSeriesJson('[]')).toEqual({ ok: true, series: [] })
  })

  it('rejects invalid JSON without applying', () => {
    const result = parseSeriesJson('{not json')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toMatch(/Invalid JSON/)
  })

  it('rejects malformed series shape', () => {
    const result = parseSeriesJson('[{"ticker":"X","label":"X","points":[]}]')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toMatch(/points/)
  })
})
