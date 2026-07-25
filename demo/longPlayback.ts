import type { RrgQuadrant, RrgRenderSeries } from '../src/types/rrg'

function quadrant(x: number, y: number): RrgQuadrant {
  if (x >= 100 && y >= 100) return 'leading'
  if (x >= 100 && y < 100) return 'weakening'
  if (x < 100 && y < 100) return 'lagging'
  return 'improving'
}

/** Weekly ISO dates starting 2020-01-03 — safe for 500+ frames. */
export function weeklyDates(count: number, startIso = '2020-01-03'): string[] {
  const start = new Date(`${startIso}T00:00:00Z`)
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start)
    d.setUTCDate(start.getUTCDate() + i * 7)
    return d.toISOString().slice(0, 10)
  })
}

const SECTORS = [
  { ticker: 'XLK', label: 'XLK', name: 'Technology', phase: 0 },
  { ticker: 'XLF', label: 'XLF', name: 'Financials', phase: 1 },
  { ticker: 'XLE', label: 'XLE', name: 'Energy', phase: 2 },
  { ticker: 'XLU', label: 'XLU', name: 'Utilities', phase: 3 },
  { ticker: 'XLI', label: 'XLI', name: 'Industrials', phase: 4 },
  { ticker: 'XLV', label: 'XLV', name: 'Health Care', phase: 5 },
  { ticker: 'XLY', label: 'XLY', name: 'Consumer Disc.', phase: 6 },
  { ticker: 'XLP', label: 'XLP', name: 'Consumer Staples', phase: 7 },
] as const

/**
 * Long-playback stress fixture: fixed ticker set, `pointsPerTicker` frames each.
 * Paths orbit 100/100 so scrubbing shows clear quadrant motion.
 */
export function makeLongPlaybackSeries(pointsPerTicker: number): RrgRenderSeries[] {
  const n = Math.max(2, Math.floor(pointsPerTicker))
  const dates = weeklyDates(n)

  return SECTORS.map((s, si) => {
    const radius = 4 + (si % 4)
    const points = dates.map((date, i) => {
      const t = (i / Math.max(n - 1, 1)) * Math.PI * 2 + s.phase * 0.7
      const x = 100 + radius * Math.cos(t) + Math.sin(i * 0.11 + si) * 0.4
      const y = 100 + radius * Math.sin(t) + Math.cos(i * 0.09 + si) * 0.4
      return { date, x, y, quadrant: quadrant(x, y) }
    })
    return { ticker: s.ticker, label: s.label, name: s.name, points }
  })
}

export const LONG_PLAYBACK_LENGTHS = [50, 100, 200, 500] as const
export type LongPlaybackLength = (typeof LONG_PLAYBACK_LENGTHS)[number]

export const longPlayback50Mock = makeLongPlaybackSeries(50)
export const longPlayback100Mock = makeLongPlaybackSeries(100)
export const longPlayback200Mock = makeLongPlaybackSeries(200)
export const longPlayback500Mock = makeLongPlaybackSeries(500)
