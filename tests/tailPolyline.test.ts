import { describe, expect, it } from 'vitest'
import { tailPolylinePoints } from '../src/utils/tailPolyline'

describe('tailPolylinePoints', () => {
  it('returns empty string for no segments', () => {
    expect(tailPolylinePoints([])).toBe('')
  })

  it('joins consecutive segment endpoints', () => {
    expect(
      tailPolylinePoints([
        { x1: 1, y1: 2, x2: 3, y2: 4 },
        { x1: 3, y1: 4, x2: 5, y2: 6 },
      ]),
    ).toBe('1,2 3,4 5,6')
  })
})
