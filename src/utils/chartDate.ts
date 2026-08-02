import type { RrgRenderSeries } from '../types/rrg'
import { snapDateIndex } from './playback'
import { buildSeriesIndex, type SeriesIndex } from './seriesIndex'

export type ChartDateStatus = 'exact' | 'snapped' | 'empty'

export type ResolvedChartDate = {
  status: ChartDateStatus
  /** Resolved ISO date used for rendering; empty string when `status === 'empty'`. */
  date: string
  /** Unique ascending dates across visible series points. */
  dates: string[]
}

/** Collect unique ISO dates from visible series, sorted ascending. */
export function collectSeriesDates(series: RrgRenderSeries[]): string[] {
  return [...buildSeriesIndex(series).dates]
}

/**
 * Resolve `selectedDate` against a prebuilt series index.
 * Mismatches snap to the nearest date (`snapDateIndex`).
 * Empty series / no dates → `empty`.
 */
export function resolveChartDateFromIndex(
  index: SeriesIndex,
  selectedDate: string,
): ResolvedChartDate {
  const dates = [...index.dates]
  if (dates.length === 0) {
    return { status: 'empty', date: '', dates }
  }
  const idx = snapDateIndex(dates, selectedDate)
  if (idx < 0) {
    return { status: 'empty', date: '', dates }
  }
  const date = dates[idx]!
  return {
    status: date === selectedDate ? 'exact' : 'snapped',
    date,
    dates,
  }
}

/**
 * Resolve `selectedDate` against series dates.
 * Mismatches snap to the nearest date (`snapDateIndex`).
 * Empty series / no dates → `empty`.
 */
export function resolveChartDate(
  series: RrgRenderSeries[],
  selectedDate: string,
): ResolvedChartDate {
  return resolveChartDateFromIndex(buildSeriesIndex(series), selectedDate)
}
