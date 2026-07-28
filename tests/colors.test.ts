import { describe, expect, it } from 'vitest'
import { assignSeriesColors, DEFAULT_PALETTE, seriesColorAt } from '../src/utils/colors'
import type { RrgRenderSeries } from '../src/types/rrg'

const base: RrgRenderSeries[] = [
  { ticker: 'A', label: 'A', points: [] },
  { ticker: 'B', label: 'B', color: '#111111', points: [] },
  { ticker: 'C', label: 'C', points: [] },
]

describe('assignSeriesColors', () => {
  it('assigns palette colors when color is omitted', () => {
    const result = assignSeriesColors(base)
    expect(result[0].color).toBe(DEFAULT_PALETTE[0])
    expect(result[2].color).toBe(DEFAULT_PALETTE[2])
  })

  it('preserves explicit colors', () => {
    expect(assignSeriesColors(base)[1].color).toBe('#111111')
  })

  it('is deterministic', () => {
    expect(assignSeriesColors(base)).toEqual(assignSeriesColors(base))
  })

  it('seriesColorAt matches assignSeriesColors entries', () => {
    expect(seriesColorAt(base[0], 0)).toBe(DEFAULT_PALETTE[0])
    expect(seriesColorAt(base[1], 1)).toBe('#111111')
  })
})
