export type BoundingBox = {
  x: number
  y: number
  w: number
  h: number
}

export type LabelLayoutOptions = {
  offsetDistance?: number
  labelHeight?: number
  charWidth?: number
  collisionPadding?: number
  binWidth?: number
  binHeight?: number
}

export type PixelPoint = {
  ticker: string
  label: string
  px: number
  py: number
}

export type ResolvedLabel = {
  ticker: string
  label: string
  x: number
  y: number
  visible: boolean
  pointX: number
  pointY: number
}

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

export function estimateLabelWidth(label: string, charWidth = 7): number {
  return Math.max(charWidth * 2, label.length * charWidth)
}

export function intersects(a: BoundingBox, b: BoundingBox): boolean {
  return !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y)
}

function binsCoveredByRect(
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
 * Spatial bin label layout — grid-based collision avoidance.
 * Sort by label length asc, then ticker; occupy AABB bins; hide if no slot.
 */
export function computeSpatialBinLayout(
  points: PixelPoint[],
  options: LabelLayoutOptions = {},
): ResolvedLabel[] {
  const offsetDistance = options.offsetDistance ?? 10
  const labelHeight = options.labelHeight ?? 12
  const charWidth = options.charWidth ?? 7
  const collisionPadding = options.collisionPadding ?? 2
  const binWidth =
    options.binWidth ?? Math.ceil(charWidth * 3 + collisionPadding * 2)
  const binHeight = options.binHeight ?? labelHeight + collisionPadding * 2

  const ordered = [...points].sort((a, b) => {
    const len = a.label.length - b.label.length
    if (len !== 0) return len
    return a.ticker.localeCompare(b.ticker)
  })

  const occupied = new Set<string>()
  const placed: BoundingBox[] = []
  const results: ResolvedLabel[] = []

  for (const point of ordered) {
    const labelW = estimateLabelWidth(point.label, charWidth)
    const preferredX = point.px + offsetDistance
    const preferredY = point.py - labelHeight / 2
    const baseCol = Math.floor(preferredX / binWidth)
    const baseRow = Math.floor(preferredY / binHeight)

    let bestX: number | null = null
    let bestY: number | null = null

    for (const [dc, dr] of ADJACENT_ORDER) {
      const labelX = (baseCol + dc) * binWidth
      const labelY = (baseRow + dr) * binHeight
      const keys = binsCoveredByRect(labelX, labelY, labelW, labelHeight, binWidth, binHeight)
      if (keys.some((k) => occupied.has(k))) continue

      const box: BoundingBox = {
        x: labelX - collisionPadding,
        y: labelY - collisionPadding,
        w: labelW + collisionPadding * 2,
        h: labelHeight + collisionPadding * 2,
      }
      if (placed.some((existing) => intersects(box, existing))) continue

      for (const k of keys) occupied.add(k)
      placed.push(box)
      bestX = labelX
      bestY = labelY
      break
    }

    results.push({
      ticker: point.ticker,
      label: point.label,
      x: bestX ?? preferredX,
      y: bestY ?? preferredY,
      visible: bestX !== null,
      pointX: point.px,
      pointY: point.py,
    })
  }

  return results
}
