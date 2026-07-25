import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { placeForceDirected } from './forceDirected'
import { hasLabelFusing, placementKey } from './geometry'
import { placeGreedy } from './greedy'
import { shiftFrame, worstCaseCluster } from './mockData'
import { renderPlacementSvg } from './renderSvg'
import { placeSpatialBin } from './spatialBin'
import type { PlacementResult, SpikePoint } from './types'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ARTIFACTS = join(__dirname, 'artifacts')

function writeArtifact(name: string, svg: string): void {
  mkdirSync(ARTIFACTS, { recursive: true })
  writeFileSync(join(ARTIFACTS, name), svg, 'utf8')
}

function runAll(points: SpikePoint[]): Record<string, PlacementResult> {
  return {
    greedy: placeGreedy(points),
    force: placeForceDirected(points),
    spatial: placeSpatialBin(points),
  }
}

/** Fraction of visible labels that kept the same candidate slot across frames. */
function candidateStability(
  a: PlacementResult,
  b: PlacementResult,
): number {
  const mapB = new Map(b.labels.map((l) => [l.ticker, l]))
  let comparable = 0
  let stable = 0
  for (const la of a.labels) {
    const lb = mapB.get(la.ticker)
    if (!lb || la.hidden || lb.hidden) continue
    comparable++
    if (la.candidateIndex === lb.candidateIndex) stable++
  }
  return comparable === 0 ? 1 : stable / comparable
}

describe('PRE-C1-A label collision spike', () => {
  it('runs all three algorithms on the worst-case mock and writes SVG artifacts', () => {
    const results = runAll(worstCaseCluster)

    writeArtifact('greedy.svg', renderPlacementSvg(results.greedy, undefined, 'Greedy Offset'))
    writeArtifact(
      'force-directed.svg',
      renderPlacementSvg(results.force, undefined, 'Force-Directed (seeded)'),
    )
    writeArtifact('spatial-bin.svg', renderPlacementSvg(results.spatial, undefined, 'Spatial Bin'))

    for (const result of Object.values(results)) {
      expect(result.labels).toHaveLength(worstCaseCluster.length)
      expect(result.placedCount + result.hiddenCount).toBe(worstCaseCluster.length)
    }

    // eslint-disable-next-line no-console -- spike summary for visual comparison runs
    console.table(
      Object.values(results).map((r) => ({
        algorithm: r.algorithm,
        placed: r.placedCount,
        hidden: r.hiddenCount,
        placedPct: Math.round((r.placedCount / worstCaseCluster.length) * 100),
        fusing: hasLabelFusing(r.labels),
      })),
    )
  })

  it('produces no label fusing for any algorithm on the worst-case mock', () => {
    const results = runAll(worstCaseCluster)
    for (const result of Object.values(results)) {
      expect(hasLabelFusing(result.labels), `${result.algorithm} fused`).toBe(false)
    }
  })

  it('is deterministic for all three algorithms', () => {
    const a = runAll(worstCaseCluster)
    const b = runAll(worstCaseCluster)
    expect(placementKey(a.greedy.labels)).toBe(placementKey(b.greedy.labels))
    expect(placementKey(a.force.labels)).toBe(placementKey(b.force.labels))
    expect(placementKey(a.spatial.labels)).toBe(placementKey(b.spatial.labels))
  })

  it('keeps spatial-bin placement stable across simulated date replay frames', () => {
    const frame0 = placeSpatialBin(shiftFrame(worstCaseCluster, 0))
    const frame1 = placeSpatialBin(shiftFrame(worstCaseCluster, 1))
    const frame2 = placeSpatialBin(shiftFrame(worstCaseCluster, 2))

    const s01 = candidateStability(frame0, frame1)
    const s12 = candidateStability(frame1, frame2)

    expect(s01).toBeGreaterThanOrEqual(0.65)
    expect(s12).toBeGreaterThanOrEqual(0.65)
    expect(hasLabelFusing(frame0.labels)).toBe(false)
    expect(hasLabelFusing(frame1.labels)).toBe(false)
  })

  it('keeps greedy placement stable across simulated date replay frames', () => {
    const frame0 = placeGreedy(shiftFrame(worstCaseCluster, 0))
    const frame1 = placeGreedy(shiftFrame(worstCaseCluster, 1))
    const frame2 = placeGreedy(shiftFrame(worstCaseCluster, 2))

    const s01 = candidateStability(frame0, frame1)
    const s12 = candidateStability(frame1, frame2)

    // Greedy candidate slots should mostly hold under small motion
    expect(s01).toBeGreaterThanOrEqual(0.7)
    expect(s12).toBeGreaterThanOrEqual(0.7)
    expect(hasLabelFusing(frame0.labels)).toBe(false)
    expect(hasLabelFusing(frame1.labels)).toBe(false)
  })

  it('completes greedy placement well under 5ms for 50 tickers', () => {
    const dense: SpikePoint[] = Array.from({ length: 50 }, (_, i) => ({
      ticker: `T${String(i).padStart(2, '0')}`,
      x: 100 + ((i % 10) - 5) * 0.8,
      y: 100 + (Math.floor(i / 10) - 2) * 0.8,
    }))

    const start = performance.now()
    for (let i = 0; i < 20; i++) placeGreedy(dense)
    const avgMs = (performance.now() - start) / 20

    expect(avgMs).toBeLessThan(5)
  })

  it('selects spatial-bin as the winner (full placement, no fusing)', () => {
    const greedy = placeGreedy(worstCaseCluster)
    const force = placeForceDirected(worstCaseCluster)
    const spatial = placeSpatialBin(worstCaseCluster)

    expect(hasLabelFusing(spatial.labels)).toBe(false)
    expect(spatial.placedCount).toBe(worstCaseCluster.length)
    expect(spatial.placedCount).toBeGreaterThanOrEqual(greedy.placedCount)
    expect(spatial.placedCount).toBeGreaterThanOrEqual(force.placedCount)
  })
})
