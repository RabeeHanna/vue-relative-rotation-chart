import { extent } from 'd3-array'
import { padExtent, roundDomainBound } from './bounds'
import type { RrgDomain } from '../types/rrg'
import type { RrgRenderSeries } from '../types/rrg'
import {
  buildSeriesIndex,
  mergeVisibleBounds,
  type SeriesIndex,
} from './seriesIndex'

/** Fixed RRG quadrant center on both axes (Policy A anchor). */
export const RRG_DOMAIN_CENTER = 100

/**
 * Policy A: auto-derived domains always include the quadrant center so labels
 * and center lines describe the visible region.
 */
export function expandDomainToIncludeCenter(
  domain: RrgDomain,
  center = RRG_DOMAIN_CENTER,
): RrgDomain {
  return {
    xMin: Math.min(domain.xMin, center),
    xMax: Math.max(domain.xMax, center),
    yMin: Math.min(domain.yMin, center),
    yMax: Math.max(domain.yMax, center),
  }
}

export function centerDomain(radius: number): RrgDomain {
  return {
    xMin: 100 - radius,
    xMax: 100 + radius,
    yMin: 100 - radius,
    yMax: 100 + radius,
  }
}

export function maxDomainFromIndex(index: SeriesIndex, padding = 2): RrgDomain {
  const bounds = mergeVisibleBounds(index.entries)
  if (!bounds) return centerDomain(10)
  const [pxMin, pxMax] = padExtent(bounds.xMin, bounds.xMax, padding)
  const [pyMin, pyMax] = padExtent(bounds.yMin, bounds.yMax, padding)
  return expandDomainToIncludeCenter({
    xMin: pxMin,
    xMax: pxMax,
    yMin: pyMin,
    yMax: pyMax,
  })
}

export function maxDomain(series: RrgRenderSeries[], padding = 2): RrgDomain {
  return maxDomainFromIndex(buildSeriesIndex(series), padding)
}

/** Fit-All: extent of current frame + tails, no outlier clipping. */
export function fitDomainFromIndex(
  index: SeriesIndex,
  selectedDate: string,
  tailLength: number,
  padding = 5,
): RrgDomain {
  const xs: number[] = []
  const ys: number[] = []

  for (const entry of index.entries) {
    if (!entry.visible) continue
    const endIdx = entry.dateToIndex.get(selectedDate)
    if (endIdx === undefined) continue
    const startIdx = Math.max(0, endIdx - Math.max(1, tailLength) + 1)
    for (let i = startIdx; i <= endIdx; i++) {
      const point = entry.points[i]!
      xs.push(point.x)
      ys.push(point.y)
    }
  }

  if (xs.length === 0) return centerDomain(10)

  const [xMin, xMax] = extent(xs) as [number, number]
  const [yMin, yMax] = extent(ys) as [number, number]
  return expandDomainToIncludeCenter({
    xMin: roundDomainBound(xMin - padding, 0.5, 'floor'),
    xMax: roundDomainBound(xMax + padding, 0.5, 'ceil'),
    yMin: roundDomainBound(yMin - padding, 0.5, 'floor'),
    yMax: roundDomainBound(yMax + padding, 0.5, 'ceil'),
  })
}

export function fitDomain(
  series: RrgRenderSeries[],
  selectedDate: string,
  tailLength: number,
  padding = 5,
): RrgDomain {
  return fitDomainFromIndex(buildSeriesIndex(series), selectedDate, tailLength, padding)
}
