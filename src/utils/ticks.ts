import { ticks } from 'd3-array'

/** Generate readable tick values for a numeric domain. */
export function generateTicks(min: number, max: number, targetCount = 5): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return []
  if (min === max) return [min]
  const lo = Math.min(min, max)
  const hi = Math.max(min, max)
  return ticks(lo, hi, targetCount)
}
