import {
  estimateLabelWidth,
  labelRect,
  rectsCollide,
  sortByLabelLengthAsc,
  summarize,
  toPixel,
} from './geometry'
import type { ChartTransform, LabelMetrics, PlacedLabel, PlacementResult, SpikePoint } from './types'
import { CANDIDATE_OFFSETS, DEFAULT_METRICS, DEFAULT_TRANSFORM } from './types'

/**
 * Algorithm 1: Greedy Offset Candidate Search
 * Place shorter labels first; try fixed 8-compass offsets; hide if none fit.
 */
export function placeGreedy(
  points: SpikePoint[],
  transform: ChartTransform = DEFAULT_TRANSFORM,
  metrics: LabelMetrics = DEFAULT_METRICS,
): PlacementResult {
  const ordered = sortByLabelLengthAsc(points)
  const placed: PlacedLabel[] = []

  for (const point of ordered) {
    const { px, py } = toPixel(point, transform)
    const width = estimateLabelWidth(point.ticker, metrics)
    const height = metrics.labelHeight
    const dist = metrics.offsetDistance

    let chosen: PlacedLabel | null = null

    for (let i = 0; i < CANDIDATE_OFFSETS.length; i++) {
      const { dx, dy } = CANDIDATE_OFFSETS[i]
      // Anchor label so the nearest corner/edge faces the point
      const labelX = dx >= 0 ? px + dist * dx : px + dist * dx - width
      const labelY = dy >= 0 ? py + dist * dy : py + dist * dy - height
      // When dx/dy is 0, center on that axis offset from point
      const adjustedX = dx === 0 ? px - width / 2 : labelX
      const adjustedY = dy === 0 ? py - height / 2 : labelY

      const candidate: PlacedLabel = {
        ticker: point.ticker,
        pointX: point.x,
        pointY: point.y,
        px,
        py,
        labelX: adjustedX,
        labelY: adjustedY,
        width,
        height,
        hidden: false,
        candidateIndex: i,
      }

      const collides = placed.some(
        (p) => !p.hidden && rectsCollide(labelRect(candidate), labelRect(p), metrics.collisionPadding),
      )
      if (!collides) {
        chosen = candidate
        break
      }
    }

    if (chosen) {
      placed.push(chosen)
    } else {
      placed.push({
        ticker: point.ticker,
        pointX: point.x,
        pointY: point.y,
        px,
        py,
        labelX: px + dist,
        labelY: py - height / 2,
        width,
        height,
        hidden: true,
        candidateIndex: -1,
      })
    }
  }

  const { placedCount, hiddenCount } = summarize(placed)
  return {
    algorithm: 'greedy-offset',
    labels: placed,
    placedCount,
    hiddenCount,
  }
}
