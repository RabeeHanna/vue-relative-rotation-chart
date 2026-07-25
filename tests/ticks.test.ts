import { describe, expect, it } from 'vitest'
import { generateTicks } from '../src/utils/ticks'

describe('generateTicks', () => {
  it('returns sensible ticks for a typical RRG domain', () => {
    const values = generateTicks(90, 110, 5)
    expect(values.length).toBeGreaterThan(0)
    expect(values[0]).toBeGreaterThanOrEqual(90)
    expect(values[values.length - 1]).toBeLessThanOrEqual(110)
  })

  it('handles equal min/max without throwing', () => {
    expect(generateTicks(100, 100, 5)).toEqual([100])
  })

  it('returns empty for non-finite bounds', () => {
    expect(generateTicks(Number.NaN, 110)).toEqual([])
  })
})
