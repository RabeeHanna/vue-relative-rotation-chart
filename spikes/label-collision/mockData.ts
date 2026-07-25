import type { SpikePoint } from './types'

/**
 * Worst-case RRG cluster mock from PRE-C1-A:
 * 15 tickers near 100/100, varied lengths, some near-overlaps, a few outliers.
 */
export const worstCaseCluster: SpikePoint[] = [
  { ticker: 'XLK', x: 102.1, y: 101.3 },
  { ticker: 'XLF', x: 101.8, y: 100.5 },
  { ticker: 'XLC', x: 100.9, y: 101.8 },
  { ticker: 'XLRE', x: 99.7, y: 100.2 },
  { ticker: 'XLI', x: 101.5, y: 99.4 },
  { ticker: 'XLB', x: 100.2, y: 98.9 },
  { ticker: 'XLV', x: 102.5, y: 100.8 },
  { ticker: 'XLU', x: 99.1, y: 101.1 },
  { ticker: 'XLE', x: 100.5, y: 102.3 },
  { ticker: 'XLP', x: 101.0, y: 100.0 },
  { ticker: 'XLY', x: 100.3, y: 99.7 },
  { ticker: 'SMH', x: 98.8, y: 100.4 },
  { ticker: 'IWM', x: 101.2, y: 101.9 },
  { ticker: 'QQQ', x: 102.8, y: 101.0 },
  { ticker: 'SPY', x: 99.5, y: 99.2 },
  // Extra density + near-exact overlap cases
  { ticker: 'XLNX', x: 101.9, y: 101.4 },
  { ticker: 'SMCAP', x: 100.1, y: 100.1 },
  { ticker: 'DIA', x: 100.0, y: 100.0 },
  // Outliers
  { ticker: 'OUTA', x: 90.0, y: 110.0 },
  { ticker: 'OUTB', x: 110.0, y: 90.0 },
]

/** Slightly shifted frame for replay-stability checks. */
export function shiftFrame(points: SpikePoint[], frame: number): SpikePoint[] {
  const t = frame * 0.15
  return points.map((p, i) => ({
    ...p,
    x: p.x + Math.sin(t + i * 0.4) * 0.35,
    y: p.y + Math.cos(t + i * 0.5) * 0.35,
  }))
}
