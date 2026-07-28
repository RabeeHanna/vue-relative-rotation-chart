import { describe, expect, it } from 'vitest'
import {
  applyVisibleTickers,
  filterVisibleTickers,
  hideAllTickers,
  seriesTickers,
  showAllTickers,
  soloTicker,
} from '../src/composables/useRrgSeriesVisibility'
import { mockSeries } from '../src/scenarios'

describe('useRrgSeriesVisibility helpers', () => {
  const series = mockSeries

  it('maps visible tickers onto series copies', () => {
    const visible = applyVisibleTickers(series, ['XLK', 'XLF'])
    expect(visible.find((s) => s.ticker === 'XLK')?.visible).not.toBe(false)
    expect(visible.find((s) => s.ticker === 'XLE')?.visible).toBe(false)
  })

  it('filters stale tickers after series changes', () => {
    expect(filterVisibleTickers(['XLK', 'MISSING'], series)).toEqual(['XLK'])
  })

  it('supports bulk show, hide, and solo helpers', () => {
    expect(showAllTickers(series)).toEqual(seriesTickers(series))
    expect(hideAllTickers()).toEqual([])
    expect(soloTicker('XLK')).toEqual(['XLK'])
  })
})
