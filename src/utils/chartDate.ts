import type { RrgRenderSeries } from '../types/rrg'
import { snapDateIndex } from './playback'

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
  const set = new Set<string>()
  for (const s of series) {
    if (s.visible === false) continue
    for (const p of s.points) {
      if (p.date) set.add(p.date)
    }
  }
  return [...set].sort()
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
  const dates = collectSeriesDates(series)
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
