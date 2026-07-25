import { describe, expect, it } from 'vitest'
import {
  patternElementId,
  patternKindForIndex,
  RRG_PATTERN_KINDS,
} from '../src/utils/patterns'

describe('patterns', () => {
  it('cycles five deterministic pattern kinds', () => {
    expect(patternKindForIndex(0)).toBe('hatch-0')
    expect(patternKindForIndex(4)).toBe('cross')
    expect(patternKindForIndex(5)).toBe(RRG_PATTERN_KINDS[0])
  })

  it('builds stable pattern element ids', () => {
    expect(patternElementId('XLK')).toBe('rrg-pattern-XLK')
    expect(patternElementId('BRK.B')).toBe('rrg-pattern-BRK-B')
  })
})
