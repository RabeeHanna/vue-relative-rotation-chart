import {
  estimateLabelWidth,
  labelRect,
  rectsCollide,
  sortByLabelLengthAsc,
  summarize,
  toPixel,
} from './geometry'
import type { ChartTransform, LabelMetrics, PlacedLabel, PlacementResult, SpikePoint } from './types'
import { DEFAULT_METRICS, DEFAULT_TRANSFORM } from './types'

/** Adjacent bin search order relative to preferred bin (dx, dy). */
const ADJACENT_ORDER: Array<[number, number]> = [
  [0, 0],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [2, 0],
  [0, -2],
  [-2, 0],
  [0, 2],
  [2, -1],
  [2, 1],
  [-2, -1],
  [-2, 1],
  [1, -2],
  [-1, -2],
  [1, 2],
  [-1, 2],
]

function binKeysForRect(
  labelX: number,
  labelY: number,
  width: number,
  height: number,
  binWidth: number,
  binHeight: number,
): string[] {
  const c0 = Math.floor(labelX / binWidth)
  const c1 = Math.floor((labelX + width - 0.001) / binWidth)
  const r0 = Math.floor(labelY / binHeight)
  const r1 = Math.floor((labelY + height - 0.001) / binHeight)
  const keys: string[] = []
  for (let c = c0; c <= c1; c++) {
    for (let r = r0; r <= r1; r++) {
      keys.push(`${c},${r}`)
    }
  }
  return keys
}

/**
 * Algorithm 3: Spatial Binning (Hybrid)
 * Snap labels into exclusive bins; occupy every bin the label AABB covers;
 * try adjacent bins; hide if none free.
 */
export function placeSpatialBin(
  points: SpikePoint[],
  transform: ChartTransform = DEFAULT_TRANSFORM,
  metrics: LabelMetrics = DEFAULT_METRICS,
  options: { binWidth?: number; binHeight?: number } = {},
): PlacementResult {
  // Bin size matches typical short-label footprint so exclusion maps to AABB space
  const binWidth = options.binWidth ?? Math.ceil(metrics.charWidth * 3 + metrics.collisionPadding * 2)
  const binHeight = options.binHeight ?? metrics.labelHeight + metrics.collisionPadding * 2
  const ordered = sortByLabelLengthAsc(points)
  const occupied = new Set<string>()
  const placed: PlacedLabel[] = []
  const dist = metrics.offsetDistance

  for (const point of ordered) {
    const { px, py } = toPixel(point, transform)
    const width = estimateLabelWidth(point.ticker, metrics)
    const height = metrics.labelHeight
    const preferredX = px + dist
    const preferredY = py - height / 2
    const baseCol = Math.floor(preferredX / binWidth)
    const baseRow = Math.floor(preferredY / binHeight)

    let chosen: PlacedLabel | null = null

    for (let i = 0; i < ADJACENT_ORDER.length; i++) {
      const [dc, dr] = ADJACENT_ORDER[i]
      const labelX = (baseCol + dc) * binWidth
      const labelY = (baseRow + dr) * binHeight
      const keys = binKeysForRect(labelX, labelY, width, height, binWidth, binHeight)
      if (keys.some((k) => occupied.has(k))) continue

      const candidate: PlacedLabel = {
        ticker: point.ticker,
        pointX: point.x,
        pointY: point.y,
        px,
        py,
        labelX,
        labelY,
        width,
        height,
        hidden: false,
        candidateIndex: i,
      }

      // Safety: AABB check against already-placed labels
      const collides = placed.some(
        (p) => !p.hidden && rectsCollide(labelRect(candidate), labelRect(p), metrics.collisionPadding),
      )
      if (collides) continue

      for (const k of keys) occupied.add(k)
      chosen = candidate
      break
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
        labelX: preferredX,
        labelY: preferredY,
        width,
        height,
        hidden: true,
        candidateIndex: -1,
      })
    }
  }

  const { placedCount, hiddenCount } = summarize(placed)
  return {
    algorithm: 'spatial-bin',
    labels: placed,
    placedCount,
    hiddenCount,
  }
}
