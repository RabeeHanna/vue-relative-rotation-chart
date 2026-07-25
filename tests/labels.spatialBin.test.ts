import { describe, expect, it } from 'vitest'
import { computeSpatialBinLayout } from '../src/utils/labels'

function clusterPoints(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    ticker: `T${String(i).padStart(2, '0')}`,
    label: i % 3 === 0 ? `LONG${i}` : `T${i}`,
    px: 200 + (i % 5) * 3,
    py: 200 + Math.floor(i / 5) * 3,
  }))
}

describe('computeSpatialBinLayout', () => {
  it('places dense labels without AABB overlaps among visible ones', () => {
    const layout = computeSpatialBinLayout(clusterPoints(16))
    const visible = layout.filter((l) => l.visible)
    expect(visible.length).toBeGreaterThan(0)

    for (let i = 0; i < visible.length; i++) {
      for (let j = i + 1; j < visible.length; j++) {
        const a = visible[i]
        const b = visible[j]
        const aw = a.label.length * 7
        const bw = b.label.length * 7
        const overlap = !(
          a.x + aw <= b.x ||
          b.x + bw <= a.x ||
          a.y + 12 <= b.y ||
          b.y + 12 <= a.y
        )
        expect(overlap).toBe(false)
      }
    }
  })

  it('is deterministic', () => {
    const points = clusterPoints(12)
    expect(computeSpatialBinLayout(points)).toEqual(computeSpatialBinLayout(points))
  })
})
