import type { RrgRenderSeries } from '../types/rrg'

export function seriesTickers(series: readonly RrgRenderSeries[]): string[] {
  return series.map((item) => item.ticker)
}

/** Apply `visibleTickers` onto series copies for chart rendering. */
export function applyVisibleTickers(
  series: readonly RrgRenderSeries[],
  visibleTickers: readonly string[],
): RrgRenderSeries[] {
  const visible = new Set(visibleTickers)
  return series.map((item) => ({
    ...item,
    visible: visible.has(item.ticker),
  }))
}

/** Drop tickers that are not in the current series list. */
export function filterVisibleTickers(
  visibleTickers: readonly string[],
  series: readonly RrgRenderSeries[],
): string[] {
  const valid = new Set(seriesTickers(series))
  return visibleTickers.filter((ticker) => valid.has(ticker))
}

export function showAllTickers(series: readonly RrgRenderSeries[]): string[] {
  return seriesTickers(series)
}

export function hideAllTickers(): string[] {
  return []
}

export function soloTicker(ticker: string): string[] {
  return [ticker]
}
