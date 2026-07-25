import type { RrgLabelMode, RrgQuadrant, RrgRenderSeries, RrgViewportMode } from '../src/types/rrg'
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
  visible?: boolean,
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
  return { ticker, label, name, points, ...(visible === false ? { visible: false } : {}) }
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

export const farRightOutlierMock = clusterWithOutlier({ ticker: 'OUT', x: 145, y: 105 })
export const farLeftOutlierMock = clusterWithOutlier({ ticker: 'OUT', x: 65, y: 95 })

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

/** One ticker parked in each quadrant. */
export const quadrantTourMock: RrgRenderSeries[] = [
  trail('LEAD', 'LEAD', { x: 108, y: 108 }, [{ dx: 0.3, dy: -0.2 }, { dx: 0.2, dy: 0.1 }], 'Leading'),
  trail('WEAK', 'WEAK', { x: 108, y: 92 }, [{ dx: 0.2, dy: -0.3 }, { dx: -0.1, dy: -0.2 }], 'Weakening'),
  trail('LAGG', 'LAGG', { x: 92, y: 92 }, [{ dx: -0.3, dy: -0.1 }, { dx: -0.2, dy: 0.2 }], 'Lagging'),
  trail('IMPR', 'IMPR', { x: 92, y: 108 }, [{ dx: -0.2, dy: 0.3 }, { dx: 0.2, dy: 0.1 }], 'Improving'),
]

/** Classic clockwise rotation through all four quadrants. */
export const rotationCycleMock: RrgRenderSeries[] = [
  trail('CYCLE', 'CYCLE', { x: 105, y: 105 }, [
    { dx: 2, dy: -4 },
    { dx: 1, dy: -4 },
    { dx: -4, dy: -2 },
    { dx: -4, dy: 1 },
    { dx: -2, dy: 4 },
    { dx: 1, dy: 4 },
    { dx: 4, dy: 2 },
    { dx: 3, dy: -1 },
  ], 'Rotation cycle'),
]

/** Single date — sparse frame; paste `[]` in BYO for fully empty. */
export const emptyOrSparseMock: RrgRenderSeries[] = [
  {
    ticker: 'SPARSE',
    label: 'SPARSE',
    name: 'Single date',
    points: [{ date: '2024-06-15', x: 100, y: 100, quadrant: 'leading' }],
  },
]

/** Two visible, two hidden via `visible: false`. */
export const mixedVisibilityMock: RrgRenderSeries[] = [
  trail('SHOW', 'SHOW', { x: 104, y: 103 }, [{ dx: 0.4, dy: 0.2 }, { dx: 0.3, dy: -0.1 }], 'Visible A'),
  trail('HIDE', 'HIDE', { x: 96, y: 97 }, [{ dx: -0.3, dy: -0.2 }, { dx: -0.2, dy: 0.1 }], 'Hidden', false),
  trail('SHOW2', 'SHOW2', { x: 102, y: 96 }, [{ dx: 0.2, dy: -0.3 }, { dx: 0.1, dy: -0.2 }], 'Visible B'),
  trail('HIDE2', 'HIDE2', { x: 97, y: 104 }, [{ dx: -0.2, dy: 0.3 }, { dx: 0.1, dy: 0.2 }], 'Hidden B', false),
]

export type ScenarioId =
  | 'default'
  | 'denseCluster'
  | 'farRightOutlier'
  | 'farLeftOutlier'
  | 'manyOverlapping'
  | 'noisyTail'
  | 'singleTicker'
  | 'stress'
  | 'missingLabel'
  | 'longLabel'
  | 'quadrantTour'
  | 'rotationCycle'
  | 'emptyOrSparse'
  | 'mixedVisibility'

export type ScenarioMeta = {
  id: ScenarioId
  displayName: string
  intent: string
  check: string
  suggestedViewport: RrgViewportMode
  suggestedLabelMode: RrgLabelMode
  series: RrgRenderSeries[]
}

export const scenarioCatalog: ScenarioMeta[] = [
  {
    id: 'default',
    displayName: 'Sector baseline',
    intent: 'Everyday multi-ticker view',
    check: 'Four sectors render with tails and readable labels',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: defaultSectorMock,
  },
  {
    id: 'denseCluster',
    displayName: 'Dense cluster',
    intent: 'Label collision under auto',
    check: 'Labels stay non-fusing near 100/100',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: denseClusterMock,
  },
  {
    id: 'farRightOutlier',
    displayName: 'Far-right outlier',
    intent: 'Fit-All vs center/max',
    check: 'OUT is in frame under fit; compare with center',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: farRightOutlierMock,
  },
  {
    id: 'farLeftOutlier',
    displayName: 'Far-left outlier',
    intent: 'Fit-All opposite side',
    check: 'OUT visible under fit on the left',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: farLeftOutlierMock,
  },
  {
    id: 'manyOverlapping',
    displayName: 'Coincident pairs',
    intent: 'Stacked hit targets',
    check: 'Hover still resolves a ticker for each pair',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'always',
    series: manyOverlappingMock,
  },
  {
    id: 'noisyTail',
    displayName: 'Noisy tails',
    intent: 'Direction readability',
    check: 'Zigzag and CCW tails remain visually distinct',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: noisyTailMock,
  },
  {
    id: 'singleTicker',
    displayName: 'Single ticker',
    intent: 'Degenerate / sparse UI',
    check: 'SOLO point and label render alone',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: singleTickerMock,
  },
  {
    id: 'stress',
    displayName: 'Stress 50×30',
    intent: 'Fixed density / perf story',
    check: '50 points render; prefer labelMode=hover',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'hover',
    series: stressMock,
  },
  {
    id: 'missingLabel',
    displayName: 'Missing labels',
    intent: 'Tooltip still shows ticker',
    check: 'Hover NLBL tooltip contains NLBL',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: missingLabelMock,
  },
  {
    id: 'longLabel',
    displayName: 'Long labels',
    intent: 'Collision + width',
    check: 'NASDAQCOMP does not fuse with neighbors',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: longLabelMock,
  },
  {
    id: 'quadrantTour',
    displayName: 'Quadrant tour',
    intent: 'One ticker per quadrant',
    check: 'LEAD/WEAK/LAGG/IMPR sit in distinct quadrants',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'always',
    series: quadrantTourMock,
  },
  {
    id: 'rotationCycle',
    displayName: 'Rotation cycle',
    intent: 'Classic clockwise RRG path',
    check: 'Scrubbing CYCLE walks through all quadrants',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: rotationCycleMock,
  },
  {
    id: 'emptyOrSparse',
    displayName: 'Empty / sparse',
    intent: 'Graceful empty & single-date',
    check: 'SPARSE single-date frame; BYO [] for empty',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: emptyOrSparseMock,
  },
  {
    id: 'mixedVisibility',
    displayName: 'Mixed visibility',
    intent: 'Some visible: false',
    check: 'Only SHOW/SHOW2 points appear',
    suggestedViewport: 'fit',
    suggestedLabelMode: 'auto',
    series: mixedVisibilityMock,
  },
]

export const scenarioById = Object.fromEntries(
  scenarioCatalog.map((s) => [s.id, s]),
) as Record<ScenarioId, ScenarioMeta>

/** Flat map used by older demo / C11 tests. */
export const adversarialScenarios = Object.fromEntries(
  scenarioCatalog.map((s) => [s.id, s.series]),
) as Record<ScenarioId, RrgRenderSeries[]>

export type AdversarialScenario = ScenarioId

export function datesForSeries(series: RrgRenderSeries[]): string[] {
  const set = new Set<string>()
  for (const s of series) {
    for (const p of s.points) set.add(p.date)
  }
  return [...set].sort()
}

export function isScenarioId(value: string | null): value is ScenarioId {
  return value != null && value in scenarioById
}
