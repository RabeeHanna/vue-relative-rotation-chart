import type { RrgQuadrant, RrgRenderSeries } from '../src/types/rrg'

const QUADRANTS = new Set<RrgQuadrant>(['leading', 'weakening', 'lagging', 'improving'])

export type ParseSeriesResult =
  | { ok: true; series: RrgRenderSeries[] }
  | { ok: false; error: string }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parsePoint(raw: unknown, path: string): string | null {
  if (!isRecord(raw)) return `${path} must be an object`
  if (typeof raw.date !== 'string' || !raw.date) return `${path}.date must be a non-empty string`
  if (typeof raw.x !== 'number' || !Number.isFinite(raw.x)) return `${path}.x must be a finite number`
  if (typeof raw.y !== 'number' || !Number.isFinite(raw.y)) return `${path}.y must be a finite number`
  if (typeof raw.quadrant !== 'string' || !QUADRANTS.has(raw.quadrant as RrgQuadrant)) {
    return `${path}.quadrant must be leading|weakening|lagging|improving`
  }
  return null
}

function parseSeriesItem(raw: unknown, index: number): string | null {
  const path = `series[${index}]`
  if (!isRecord(raw)) return `${path} must be an object`
  if (typeof raw.ticker !== 'string' || !raw.ticker) return `${path}.ticker must be a non-empty string`
  if (typeof raw.label !== 'string') return `${path}.label must be a string`
  if (!Array.isArray(raw.points) || raw.points.length === 0) {
    return `${path}.points must be a non-empty array`
  }
  for (let i = 0; i < raw.points.length; i++) {
    const err = parsePoint(raw.points[i], `${path}.points[${i}]`)
    if (err) return err
  }
  if (raw.visible !== undefined && typeof raw.visible !== 'boolean') {
    return `${path}.visible must be a boolean when present`
  }
  return null
}

/** Validate BYO JSON as `RrgRenderSeries[]`. Empty array is allowed. */
export function parseSeriesJson(text: string): ParseSeriesResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: 'Invalid JSON' }
  }

  if (!Array.isArray(parsed)) {
    return { ok: false, error: 'Root value must be an array of RrgRenderSeries' }
  }

  for (let i = 0; i < parsed.length; i++) {
    const err = parseSeriesItem(parsed[i], i)
    if (err) return { ok: false, error: err }
  }

  return { ok: true, series: parsed as RrgRenderSeries[] }
}
