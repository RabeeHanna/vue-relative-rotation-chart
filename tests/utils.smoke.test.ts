import { describe, expect, it } from 'vitest'
import { padExtent } from '../src/utils/bounds'
import { estimateLabelWidth } from '../src/utils/labels'

describe('utils placeholders', () => {
  it('padExtent adds padding to both sides', () => {
    expect(padExtent(10, 20, 2)).toEqual([8, 22])
  })

  it('estimateLabelWidth scales with ticker length', () => {
    expect(estimateLabelWidth('XLK', 7)).toBe(21)
    expect(estimateLabelWidth('A', 7)).toBe(14)
  })
})
