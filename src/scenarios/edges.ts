import type { RrgRenderSeries } from '../types/rrg'
import { trail } from './trail'

export const noisyTail: RrgRenderSeries[] = [
  trail(
    'ZZY',
    'ZZY',
    { x: 102, y: 104 },
    [
      { dx: 1.5, dy: -2 },
      { dx: -2, dy: -1 },
      { dx: -1.5, dy: 2.5 },
      { dx: 2, dy: 1.2 },
      { dx: 0.5, dy: -1.8 },
    ],
    'Zigzag',
  ),
  trail(
    'CCW',
    'CCW',
    { x: 98, y: 101 },
    [
      { dx: -1, dy: 1.5 },
      { dx: -1.5, dy: -1 },
      { dx: 1.2, dy: -1.8 },
      { dx: 1.8, dy: 0.8 },
      { dx: -0.4, dy: 1.2 },
    ],
    'Counterclockwise',
  ),
]

export const singleTicker: RrgRenderSeries[] = [
  trail(
    'SOLO',
    'SOLO',
    { x: 103, y: 101 },
    [
      { dx: 0.4, dy: 0.3 },
      { dx: 0.3, dy: -0.2 },
    ],
    'Single',
  ),
]

export const stress: RrgRenderSeries[] = Array.from({ length: 50 }, (_, t) => {
  const steps = Array.from({ length: 29 }, (_, i) => ({
    dx: ((t % 5) - 2) * 0.05,
    dy: ((i % 7) - 3) * 0.04,
  }))
  return trail(`T${t}`, `T${t}`, { x: 95 + (t % 10), y: 95 + (t % 8) }, steps)
})

export const missingLabel: RrgRenderSeries[] = [
  {
    ticker: 'NLBL',
    label: '',
    points: [
      { date: '2024-01-05', x: 101, y: 102, quadrant: 'leading' },
      { date: '2024-01-12', x: 102, y: 101, quadrant: 'leading' },
      { date: '2024-01-19', x: 103, y: 100.5, quadrant: 'weakening' },
    ],
  },
  {
    ticker: 'NONAME',
    label: 'NONAME',
    points: [
      { date: '2024-01-05', x: 97, y: 98, quadrant: 'lagging' },
      { date: '2024-01-12', x: 96.5, y: 97.5, quadrant: 'lagging' },
      { date: '2024-01-19', x: 97.2, y: 97.8, quadrant: 'lagging' },
    ],
  },
]

export const longLabel: RrgRenderSeries[] = [
  trail('XLRE', 'XLRE', { x: 101, y: 99 }, [
    { dx: 0.3, dy: 0.2 },
    { dx: 0.2, dy: -0.1 },
  ]),
  trail('SMCAP', 'SMCAP', { x: 99, y: 101 }, [
    { dx: -0.2, dy: 0.3 },
    { dx: 0.1, dy: 0.2 },
  ]),
  trail('NASDAQCOMP', 'NASDAQCOMP', { x: 104, y: 103 }, [
    { dx: 0.4, dy: -0.3 },
    { dx: -0.2, dy: -0.2 },
  ]),
]
