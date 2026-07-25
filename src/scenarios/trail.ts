import type { RrgQuadrant, RrgRenderSeries } from '../types/rrg'

export type TrailPoint = { date: string; x: number; y: number; quadrant: RrgQuadrant }

export function quadrant(x: number, y: number): RrgQuadrant {
  if (x >= 100 && y >= 100) return 'leading'
  if (x >= 100 && y < 100) return 'weakening'
  if (x < 100 && y < 100) return 'lagging'
  return 'improving'
}

export function dates(count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const day = String((i % 28) + 1).padStart(2, '0')
    const month = String(Math.floor(i / 28) + 1).padStart(2, '0')
    return `2024-${month}-${day}`
  })
}

/** Build a short geometric trail for fixture series. */
export function trail(
  ticker: string,
  label: string,
  start: { x: number; y: number },
  steps: Array<{ dx: number; dy: number }>,
  name?: string,
  visible?: boolean,
): RrgRenderSeries {
  const ds = dates(steps.length + 1)
  const points: TrailPoint[] = []
  let x = start.x
  let y = start.y
  points.push({ date: ds[0], x, y, quadrant: quadrant(x, y) })
  steps.forEach((step, i) => {
    x += step.dx
    y += step.dy
    points.push({ date: ds[i + 1], x, y, quadrant: quadrant(x, y) })
  })
  return { ticker, label, name, points, ...(visible === false ? { visible: false } : {}) }
}
