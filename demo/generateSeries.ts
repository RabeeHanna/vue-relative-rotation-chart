import type { RrgQuadrant, RrgRenderSeries } from '../src/types/rrg'

export type GenerateSeriesOptions = {
  tickerCount: number
  pointsPerTicker: number
  seed: number
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function quadrant(x: number, y: number): RrgQuadrant {
  if (x >= 100 && y >= 100) return 'leading'
  if (x >= 100 && y < 100) return 'weakening'
  if (x < 100 && y < 100) return 'lagging'
  return 'improving'
}

function dateAt(index: number): string {
  const day = String((index % 28) + 1).padStart(2, '0')
  const month = String(Math.floor(index / 28) + 1).padStart(2, '0')
  return `2024-${month}-${day}`
}

/** Seeded random-walk RRG series for Advanced generator. */
export function generateSeries(options: GenerateSeriesOptions): RrgRenderSeries[] {
  const tickerCount = Math.max(1, Math.min(100, Math.floor(options.tickerCount)))
  const pointsPerTicker = Math.max(1, Math.min(60, Math.floor(options.pointsPerTicker)))
  const rand = mulberry32(options.seed >>> 0)

  return Array.from({ length: tickerCount }, (_, t) => {
    let x = 90 + rand() * 20
    let y = 90 + rand() * 20
    const points = Array.from({ length: pointsPerTicker }, (_, i) => {
      if (i > 0) {
        x += (rand() - 0.5) * 2.5
        y += (rand() - 0.5) * 2.5
      }
      return { date: dateAt(i), x, y, quadrant: quadrant(x, y) }
    })
    const ticker = `G${String(t).padStart(2, '0')}`
    return { ticker, label: ticker, name: `Generated ${ticker}`, points }
  })
}

export function seriesJsonByteHint(series: RrgRenderSeries[]): string {
  const json = JSON.stringify(series)
  const tickers = series.length
  const points = series[0]?.points.length ?? 0
  const kb = Math.max(1, Math.round(json.length / 1024))
  return `${tickers} tickers × ${points} points — ~${kb} KB`
}
