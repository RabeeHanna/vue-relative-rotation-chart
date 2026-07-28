import type { RrgRenderSeries } from '../types/rrg'

const DEFAULT_PALETTE = [
  '#4e79a7',
  '#f28e2b',
  '#e15759',
  '#76b7b2',
  '#59a14f',
  '#edc948',
  '#b07aa1',
  '#ff9da7',
  '#9c755f',
  '#bab0ac',
]

/** Deterministic palette fill for series missing an explicit color. */
export function seriesColorAt(series: RrgRenderSeries, index: number): string {
  return series.color ?? DEFAULT_PALETTE[index % DEFAULT_PALETTE.length]
}

export function assignSeriesColors(series: RrgRenderSeries[]): RrgRenderSeries[] {
  return series.map((s, i) => ({
    ...s,
    color: seriesColorAt(s, i),
  }))
}

export { DEFAULT_PALETTE }
