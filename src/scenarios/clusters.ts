import type { RrgRenderSeries } from '../types/rrg'
import { trail } from './trail'

/** 16 tickers packed near 100/100. */
export const denseCluster: RrgRenderSeries[] = Array.from({ length: 16 }, (_, i) => {
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

export const farRightOutlier = clusterWithOutlier({ ticker: 'OUT', x: 145, y: 105 })
export const farLeftOutlier = clusterWithOutlier({ ticker: 'OUT', x: 65, y: 95 })

/** Five coincident pairs. */
export const manyOverlapping: RrgRenderSeries[] = Array.from({ length: 5 }, (_, i) => {
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
