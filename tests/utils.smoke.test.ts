import { describe, expect, it } from 'vitest'
import { padExtent, roundDomainBound } from '../src/utils/bounds'
import { estimateLabelWidth } from '../src/utils/labels'

describe('bounds utils', () => {
  it('padExtent adds padding to both sides', () => {
    expect(padExtent(10, 20, 2)).toEqual([8, 22])
  })

  it('roundDomainBound rounds down to step', () => {
    expect(roundDomainBound(10.9, 0.5)).toBe(10.5)
  })
})

describe('label utils', () => {
  it('estimateLabelWidth scales with ticker length', () => {
    expect(estimateLabelWidth('XLK', 7)).toBe(21)
    expect(estimateLabelWidth('A', 7)).toBe(14)
  })
})
