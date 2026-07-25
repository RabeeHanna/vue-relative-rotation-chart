import type {
  ChartTransform,
  LabelMetrics,
  PlacedLabel,
  Rect,
  SpikePoint,
} from './types'
import { DEFAULT_METRICS, DEFAULT_TRANSFORM } from './types'

export function estimateLabelWidth(ticker: string, metrics: LabelMetrics = DEFAULT_METRICS): number {
  return Math.max(metrics.charWidth * 2, ticker.length * metrics.charWidth)
}

export function toPixel(
  point: SpikePoint,
  transform: ChartTransform = DEFAULT_TRANSFORM,
): { px: number; py: number } {
  const { width, height, padding, xMin, xMax, yMin, yMax } = transform
  const innerW = width - padding * 2
  const innerH = height - padding * 2
  const px = padding + ((point.x - xMin) / (xMax - xMin)) * innerW
  // SVG y grows downward; data y grows upward
  const py = padding + (1 - (point.y - yMin) / (yMax - yMin)) * innerH
  return { px, py }
}

export function labelRect(label: Pick<PlacedLabel, 'labelX' | 'labelY' | 'width' | 'height'>): Rect {
  return {
    x: label.labelX,
    y: label.labelY,
    width: label.width,
    height: label.height,
  }
}

export function expandRect(rect: Rect, padding: number): Rect {
  return {
    x: rect.x - padding,
    y: rect.y - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  }
}

export function overlaps(a: Rect, b: Rect): boolean {
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  )
}

export function rectsCollide(
  a: Rect,
  b: Rect,
  padding: number = DEFAULT_METRICS.collisionPadding,
): boolean {
  return overlaps(expandRect(a, padding), expandRect(b, padding))
}

export function sortByLabelLengthAsc(points: SpikePoint[]): SpikePoint[] {
  return [...points].sort((a, b) => {
    const len = a.ticker.length - b.ticker.length
    if (len !== 0) return len
    return a.ticker.localeCompare(b.ticker)
  })
}

export function summarize(labels: PlacedLabel[]): { placedCount: number; hiddenCount: number } {
  const hiddenCount = labels.filter((l) => l.hidden).length
  return {
    placedCount: labels.length - hiddenCount,
    hiddenCount,
  }
}

/** True if any two visible labels overlap (fusing). */
export function hasLabelFusing(
  labels: PlacedLabel[],
  padding: number = DEFAULT_METRICS.collisionPadding,
): boolean {
  const visible = labels.filter((l) => !l.hidden)
  for (let i = 0; i < visible.length; i++) {
    for (let j = i + 1; j < visible.length; j++) {
      if (rectsCollide(labelRect(visible[i]), labelRect(visible[j]), padding)) {
        return true
      }
    }
  }
  return false
}

export function placementKey(labels: PlacedLabel[]): string {
  return labels
    .map((l) =>
      [
        l.ticker,
        l.hidden ? 'H' : 'V',
        l.candidateIndex,
        Math.round(l.labelX * 100) / 100,
        Math.round(l.labelY * 100) / 100,
      ].join(':'),
    )
    .sort()
    .join('|')
}
