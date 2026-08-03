import type { RrgRenderSeries, RrgSeriesPoint } from '../types/rrg'

export type SeriesBounds = {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

export type SeriesIndexEntry = {
  ticker: string
  label: string
  name?: string
  color?: string
  visible: boolean
  points: readonly RrgSeriesPoint[]
  dateToIndex: ReadonlyMap<string, number>
  bounds: SeriesBounds | null
}

export type SeriesIndex = {
  /** Input array reference this index was built from. */
  source: readonly RrgRenderSeries[]
  /** Unique ascending dates across visible series. */
  dates: readonly string[]
  entries: readonly SeriesIndexEntry[]
  byTicker: ReadonlyMap<string, SeriesIndexEntry>
}

function boundsForPoints(points: readonly RrgSeriesPoint[]): SeriesBounds | null {
  if (points.length === 0) return null
  let xMin = points[0]!.x
  let xMax = points[0]!.x
  let yMin = points[0]!.y
  let yMax = points[0]!.y
  for (let i = 1; i < points.length; i++) {
    const p = points[i]!
    if (p.x < xMin) xMin = p.x
    if (p.x > xMax) xMax = p.x
    if (p.y < yMin) yMin = p.y
    if (p.y > yMax) yMax = p.y
  }
  return { xMin, xMax, yMin, yMax }
}

function indexEntry(series: RrgRenderSeries): SeriesIndexEntry {
  const dateToIndex = new Map<string, number>()
  for (let i = 0; i < series.points.length; i++) {
    dateToIndex.set(series.points[i]!.date, i)
  }
  return {
    ticker: series.ticker,
    label: series.label,
    name: series.name,
    color: series.color,
    visible: series.visible !== false,
    points: series.points,
    dateToIndex,
    bounds: boundsForPoints(series.points),
  }
}

/** Normalize series into sorted date union and O(1) per-ticker date lookups. */
export function buildSeriesIndex(series: readonly RrgRenderSeries[]): SeriesIndex {
  const entries = series.map(indexEntry)
  const dateSet = new Set<string>()
  for (const entry of entries) {
    if (!entry.visible) continue
    for (const point of entry.points) {
      if (point.date) dateSet.add(point.date)
    }
  }
  return {
    source: series,
    dates: [...dateSet].sort(),
    entries,
    byTicker: new Map(entries.map((entry) => [entry.ticker, entry])),
  }
}

export function getPointAtDate(
  entry: SeriesIndexEntry,
  date: string,
): RrgSeriesPoint | undefined {
  const idx = entry.dateToIndex.get(date)
  return idx === undefined ? undefined : entry.points[idx]
}

export function mergeVisibleBounds(
  entries: readonly SeriesIndexEntry[],
): SeriesBounds | null {
  let merged: SeriesBounds | null = null
  for (const entry of entries) {
    if (!entry.visible || !entry.bounds) continue
    if (!merged) {
      merged = { ...entry.bounds }
      continue
    }
    merged = {
      xMin: Math.min(merged.xMin, entry.bounds.xMin),
      xMax: Math.max(merged.xMax, entry.bounds.xMax),
      yMin: Math.min(merged.yMin, entry.bounds.yMin),
      yMax: Math.max(merged.yMax, entry.bounds.yMax),
    }
  }
  return merged
}
