import type { RrgQuadrant, RrgRenderSeries } from '../src/types/rrg'
import { mockSeries as defaultSectorMock } from './mockSeries'

export { mockSeries as defaultSectorMock, mockDates, mockSelectedDate } from './mockSeries'

type Point = { date: string; x: number; y: number; quadrant: RrgQuadrant }

function quadrant(x: number, y: number): RrgQuadrant {
  if (x >= 100 && y >= 100) return 'leading'
  if (x >= 100 && y < 100) return 'weakening'
  if (x < 100 && y < 100) return 'lagging'
  return 'improving'
}

function dates(count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const day = String((i % 28) + 1).padStart(2, '0')
    const month = String(Math.floor(i / 28) + 1).padStart(2, '0')
    return `2024-${month}-${day}`
  })
}

function trail(
  ticker: string,
  label: string,
  start: { x: number; y: number },
  steps: Array<{ dx: number; dy: number }>,
  name?: string,
): RrgRenderSeries {
  const ds = dates(steps.length + 1)
  const points: Point[] = []
  let x = start.x
  let y = start.y
  points.push({ date: ds[0], x, y, quadrant: quadrant(x, y) })
  steps.forEach((step, i) => {
    x += step.dx
    y += step.dy
    points.push({ date: ds[i + 1], x, y, quadrant: quadrant(x, y) })
  })
  return { ticker, label, name, points }
}

/** 16 tickers packed near 100/100. */
export const denseClusterMock: RrgRenderSeries[] = Array.from({ length: 16 }, (_, i) => {
  const x = 100 + ((i % 4) - 1.5) * 2.2
  const y = 100 + (Math.floor(i / 4) - 1.5) * 2.2
  return trail(`C${String(i).padStart(2, '0')}`, `C${i}`, { x: x - 1, y: y - 0.5 }, [
    { dx: 0.5, dy: 0.2 },
    { dx: 0.5, dy: 0.3 },
  ])
})

function clusterWithOutlier(
  outlier: { ticker: string; x: number; y: number },
): RrgRenderSeries[] {
  const cluster = Array.from({ length: 10 }, (_, i) => {
    const x = 99 + (i % 5) * 0.6
    const y = 99 + Math.floor(i / 5) * 0.8
    return trail(`N${i}`, `N${i}`, { x: x - 0.4, y }, [
      { dx: 0.2, dy: 0.1 },
      { dx: 0.2, dy: -0.05 },
    ])
  })
  cluster.push(
    trail(outlier.ticker, outlier.ticker, { x: outlier.x - 2, y: outlier.y }, [
      { dx: 1, dy: 0.2 },
      { dx: 1, dy: -0.1 },
    ]),
  )
  return cluster
}

export const farRightOutlierMock = clusterWithOutlier({
  ticker: 'OUT',
  x: 145,
  y: 105,
})

export const farLeftOutlierMock = clusterWithOutlier({
  ticker: 'OUT',
  x: 65,
  y: 95,
})

/** Five coincident pairs. */
export const manyOverlappingMock: RrgRenderSeries[] = Array.from({ length: 5 }, (_, i) => {
  const x = 98 + i * 3
  const y = 102 - i
  return [
    trail(`A${i}`, `A${i}`, { x: x - 0.5, y }, [
      { dx: 0.25, dy: 0 },
      { dx: 0.25, dy: 0 },
    ]),
    trail(`B${i}`, `B${i}`, { x: x - 0.5, y }, [
      { dx: 0.25, dy: 0 },
      { dx: 0.25, dy: 0 },
    ]),
  ]
}).flat()

export const noisyTailMock: RrgRenderSeries[] = [
  trail('ZZY', 'ZZY', { x: 102, y: 104 }, [
    { dx: 1.5, dy: -2 },
    { dx: -2, dy: -1 },
    { dx: -1.5, dy: 2.5 },
    { dx: 2, dy: 1.2 },
    { dx: 0.5, dy: -1.8 },
  ], 'Zigzag'),
  trail('CCW', 'CCW', { x: 98, y: 101 }, [
    { dx: -1, dy: 1.5 },
    { dx: -1.5, dy: -1 },
    { dx: 1.2, dy: -1.8 },
    { dx: 1.8, dy: 0.8 },
    { dx: -0.4, dy: 1.2 },
  ], 'Counterclockwise'),
]

export const singleTickerMock: RrgRenderSeries[] = [
  trail('SOLO', 'SOLO', { x: 103, y: 101 }, [
    { dx: 0.4, dy: 0.3 },
    { dx: 0.3, dy: -0.2 },
  ], 'Single'),
]

export const stressMock: RrgRenderSeries[] = Array.from({ length: 50 }, (_, t) => {
  const steps = Array.from({ length: 29 }, (_, i) => ({
    dx: ((t % 5) - 2) * 0.05,
    dy: ((i % 7) - 3) * 0.04,
  }))
  return trail(`T${t}`, `T${t}`, { x: 95 + (t % 10), y: 95 + (t % 8) }, steps)
})

export const missingLabelMock: RrgRenderSeries[] = [
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

export const longLabelMock: RrgRenderSeries[] = [
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

export const adversarialScenarios = {
  default: defaultSectorMock,
  denseCluster: denseClusterMock,
  farRightOutlier: farRightOutlierMock,
  farLeftOutlier: farLeftOutlierMock,
  manyOverlapping: manyOverlappingMock,
  noisyTail: noisyTailMock,
  singleTicker: singleTickerMock,
  stress: stressMock,
  missingLabel: missingLabelMock,
  longLabel: longLabelMock,
} as const

export type AdversarialScenario = keyof typeof adversarialScenarios

export function datesForSeries(series: RrgRenderSeries[]): string[] {
  const set = new Set<string>()
  for (const s of series) {
    for (const p of s.points) set.add(p.date)
  }
  return [...set].sort()
}
