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

type SimLabel = {
  ticker: string
  pointX: number
  pointY: number
  px: number
  py: number
  width: number
  height: number
  /** Label center in SVG pixels */
  cx: number
  cy: number
  preferredCx: number
  preferredCy: number
}

/**
 * Mulberry32 — fixed-seed PRNG for deterministic force simulation.
 */
function mulberry32(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Algorithm 2: Force-Directed Layout (seeded, fixed iterations)
 * Labels repel each other, attract toward preferred right-of-point offset,
 * and are clamped to a max displacement from the anchor.
 */
export function placeForceDirected(
  points: SpikePoint[],
  transform: ChartTransform = DEFAULT_TRANSFORM,
  metrics: LabelMetrics = DEFAULT_METRICS,
  options: {
    seed?: number
    iterations?: number
    repulsion?: number
    attraction?: number
    maxDisplacement?: number
  } = {},
): PlacementResult {
  const {
    seed = 42,
    iterations = 80,
    repulsion = 900,
    attraction = 0.08,
    maxDisplacement = 36,
  } = options

  const rand = mulberry32(seed)
  const ordered = sortByLabelLengthAsc(points)
  const dist = metrics.offsetDistance

  const sim: SimLabel[] = ordered.map((point) => {
    const { px, py } = toPixel(point, transform)
    const width = estimateLabelWidth(point.ticker, metrics)
    const height = metrics.labelHeight
    // Preferred: right of point, vertically centered
    const preferredCx = px + dist + width / 2
    const preferredCy = py
    // Tiny deterministic jitter so coincident points separate initially
    const jitterX = (rand() - 0.5) * 0.01
    const jitterY = (rand() - 0.5) * 0.01
    return {
      ticker: point.ticker,
      pointX: point.x,
      pointY: point.y,
      px,
      py,
      width,
      height,
      cx: preferredCx + jitterX,
      cy: preferredCy + jitterY,
      preferredCx,
      preferredCy,
    }
  })

  for (let iter = 0; iter < iterations; iter++) {
    const forces = sim.map(() => ({ fx: 0, fy: 0 }))

    for (let i = 0; i < sim.length; i++) {
      for (let j = i + 1; j < sim.length; j++) {
        const a = sim[i]
        const b = sim[j]
        let dx = b.cx - a.cx
        let dy = b.cy - a.cy
        let d2 = dx * dx + dy * dy
        if (d2 < 1e-4) {
          // Coincident: push apart along deterministic axis from seed order
          dx = 1
          dy = 0.1 * (i - j)
          d2 = dx * dx + dy * dy
        }
        const d = Math.sqrt(d2)
        const minDist =
          (a.width + b.width) / 2 +
          (a.height + b.height) / 4 +
          metrics.collisionPadding * 2
        if (d < minDist * 2) {
          const strength = (repulsion * (minDist - d)) / (d * d + 1)
          const fx = (dx / d) * strength
          const fy = (dy / d) * strength
          forces[i].fx -= fx
          forces[i].fy -= fy
          forces[j].fx += fx
          forces[j].fy += fy
        }
      }
    }

    for (let i = 0; i < sim.length; i++) {
      const s = sim[i]
      // Attract toward preferred offset
      forces[i].fx += (s.preferredCx - s.cx) * attraction
      forces[i].fy += (s.preferredCy - s.cy) * attraction
      // Mild repulsion from anchor point itself
      const adx = s.cx - s.px
      const ady = s.cy - s.py
      const ad = Math.sqrt(adx * adx + ady * ady) || 1
      if (ad < dist) {
        forces[i].fx += (adx / ad) * 2
        forces[i].fy += (ady / ad) * 2
      }

      s.cx += forces[i].fx
      s.cy += forces[i].fy

      // Clamp max displacement from preferred
      const pdx = s.cx - s.preferredCx
      const pdy = s.cy - s.preferredCy
      const pd = Math.sqrt(pdx * pdx + pdy * pdy)
      if (pd > maxDisplacement) {
        s.cx = s.preferredCx + (pdx / pd) * maxDisplacement
        s.cy = s.preferredCy + (pdy / pd) * maxDisplacement
      }
    }
  }

  // Convert to placed labels; hide remaining overlaps greedily by length priority
  const labels: PlacedLabel[] = sim.map((s) => ({
    ticker: s.ticker,
    pointX: s.pointX,
    pointY: s.pointY,
    px: s.px,
    py: s.py,
    labelX: s.cx - s.width / 2,
    labelY: s.cy - s.height / 2,
    width: s.width,
    height: s.height,
    hidden: false,
    candidateIndex: 0,
  }))

  const kept: PlacedLabel[] = []
  for (const label of labels) {
    const collides = kept.some(
      (p) => !p.hidden && rectsCollide(labelRect(label), labelRect(p), metrics.collisionPadding),
    )
    if (collides) {
      kept.push({ ...label, hidden: true, candidateIndex: -1 })
    } else {
      kept.push(label)
    }
  }

  const { placedCount, hiddenCount } = summarize(kept)
  return {
    algorithm: 'force-directed',
    labels: kept,
    placedCount,
    hiddenCount,
  }
}
