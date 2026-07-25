import { describe, expect, it } from 'vitest'
import { generateSeries, seriesJsonByteHint } from '../demo/generateSeries'

describe('generateSeries', () => {
  it('returns identical series for the same seed', () => {
    const a = generateSeries({ tickerCount: 5, pointsPerTicker: 8, seed: 99 })
    const b = generateSeries({ tickerCount: 5, pointsPerTicker: 8, seed: 99 })
    expect(a).toEqual(b)
    expect(a).toHaveLength(5)
    expect(a[0].points).toHaveLength(8)
  })

  it('diverges when the seed changes', () => {
    const a = generateSeries({ tickerCount: 3, pointsPerTicker: 4, seed: 1 })
    const b = generateSeries({ tickerCount: 3, pointsPerTicker: 4, seed: 2 })
    expect(a).not.toEqual(b)
  })

  it('Copy data JSON equals full JSON.stringify', () => {
    const series = generateSeries({ tickerCount: 2, pointsPerTicker: 3, seed: 7 })
    expect(JSON.parse(JSON.stringify(series))).toEqual(series)
    expect(seriesJsonByteHint(series)).toMatch(/2 tickers × 3 points/)
  })
})
