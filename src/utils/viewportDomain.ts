import { extent } from 'd3-array'
import { padExtent, roundDomainBound } from './bounds'
import type { RrgDomain } from '../types/rrg'
import type { RrgRenderSeries } from '../types/rrg'

/** Fixed RRG quadrant center on both axes (Policy A anchor). */
export const RRG_DOMAIN_CENTER = 100

function visibleSeries(series: RrgRenderSeries[]): RrgRenderSeries[] {
  return series.filter((item) => item.visible !== false)
}

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

export function maxDomain(series: RrgRenderSeries[], padding = 2): RrgDomain {
  const visible = visibleSeries(series)
  const allX = visible.flatMap((s) => s.points.map((p) => p.x))
  const allY = visible.flatMap((s) => s.points.map((p) => p.y))
  if (allX.length === 0) return centerDomain(10)
  const [xMin, xMax] = extent(allX) as [number, number]
  const [yMin, yMax] = extent(allY) as [number, number]
  const [pxMin, pxMax] = padExtent(xMin, xMax, padding)
  const [pyMin, pyMax] = padExtent(yMin, yMax, padding)
  return expandDomainToIncludeCenter({
    xMin: pxMin,
    xMax: pxMax,
    yMin: pyMin,
    yMax: pyMax,
  })
}

/** Fit-All: extent of current frame + tails, no outlier clipping (PRE-C1-B). */
export function fitDomain(
  series: RrgRenderSeries[],
  selectedDate: string,
  tailLength: number,
  padding = 5,
): RrgDomain {
  const xs: number[] = []
  const ys: number[] = []

  for (const s of visibleSeries(series)) {
    const endIdx = s.points.findIndex((p) => p.date === selectedDate)
    if (endIdx < 0) continue
    const startIdx = Math.max(0, endIdx - Math.max(1, tailLength) + 1)
    for (const p of s.points.slice(startIdx, endIdx + 1)) {
      xs.push(p.x)
      ys.push(p.y)
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
