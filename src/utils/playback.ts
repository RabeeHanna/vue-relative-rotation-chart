import { RRG_PLAYBACK_DEFAULTS } from '../types/rrg'

export { RRG_PLAYBACK_DEFAULTS }

export function clampSpeed(speed: number, minSpeed: number, maxSpeed: number): number {
  if (!Number.isFinite(speed)) return minSpeed
  return Math.min(maxSpeed, Math.max(minSpeed, speed))
}

/** Exact index, or `-1` when missing. */
export function findDateIndex(dates: string[], selectedDate: string): number {
  return dates.indexOf(selectedDate)
}

/**
 * Nearest index for an out-of-range date.
 * Empty `dates` → `-1`.
 */
export function snapDateIndex(dates: string[], selectedDate: string): number {
  if (dates.length === 0) return -1
  const exact = dates.indexOf(selectedDate)
  if (exact >= 0) return exact

  const target = Date.parse(selectedDate)
  if (!Number.isFinite(target)) return 0

  let best = 0
  let bestDist = Number.POSITIVE_INFINITY
  for (let i = 0; i < dates.length; i++) {
    const t = Date.parse(dates[i])
    if (!Number.isFinite(t)) continue
    const dist = Math.abs(t - target)
    if (dist < bestDist) {
      best = i
      bestDist = dist
    }
  }
  return best
}

/** Next frame index, or `null` when blocked at the end without loop. */
export function nextFrameIndex(
  index: number,
  length: number,
  loop: boolean,
): number | null {
  if (length <= 0 || index < 0) return null
  if (index < length - 1) return index + 1
  return loop ? 0 : null
}

/** Previous frame index, or `null` when blocked at the start without loop. */
export function prevFrameIndex(
  index: number,
  length: number,
  loop: boolean,
): number | null {
  if (length <= 0 || index < 0) return null
  if (index > 0) return index - 1
  return loop ? length - 1 : null
}
