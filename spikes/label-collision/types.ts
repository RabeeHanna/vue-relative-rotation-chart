export type SpikePoint = {
  ticker: string
  x: number
  y: number
}

export type Rect = {
  x: number
  y: number
  width: number
  height: number
}

export type PlacedLabel = {
  ticker: string
  /** Data-space anchor */
  pointX: number
  pointY: number
  /** SVG pixel position of point center */
  px: number
  py: number
  /** Top-left of label box in SVG pixels */
  labelX: number
  labelY: number
  width: number
  height: number
  hidden: boolean
  candidateIndex: number
}

export type PlacementResult = {
  algorithm: string
  labels: PlacedLabel[]
  placedCount: number
  hiddenCount: number
}

export type ChartTransform = {
  width: number
  height: number
  padding: number
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

export type LabelMetrics = {
  charWidth: number
  labelHeight: number
  offsetDistance: number
  collisionPadding: number
}

export const DEFAULT_TRANSFORM: ChartTransform = {
  width: 640,
  height: 640,
  padding: 48,
  xMin: 90,
  xMax: 115,
  yMin: 90,
  yMax: 115,
}

export const DEFAULT_METRICS: LabelMetrics = {
  charWidth: 7,
  labelHeight: 12,
  offsetDistance: 10,
  collisionPadding: 2,
}

/** Candidate offsets relative to point, in priority order (8-compass). */
export const CANDIDATE_OFFSETS: Array<{ dx: number; dy: number; name: string }> = [
  { dx: 1, dy: 0, name: 'right' },
  { dx: 1, dy: -1, name: 'upper-right' },
  { dx: 0, dy: -1, name: 'upper' },
  { dx: -1, dy: -1, name: 'upper-left' },
  { dx: -1, dy: 0, name: 'left' },
  { dx: -1, dy: 1, name: 'lower-left' },
  { dx: 0, dy: 1, name: 'lower' },
  { dx: 1, dy: 1, name: 'lower-right' },
]
