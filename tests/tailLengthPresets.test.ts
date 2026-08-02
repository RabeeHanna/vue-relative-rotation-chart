import { describe, expect, it } from 'vitest'
import { resolveTailLengthPresets } from '../src/utils/tailLengthPresets'
import { RRG_CHART_DEFAULTS, RRG_TAIL_LENGTH_PRESETS } from '../src/types/defaults'

describe('RRG_TAIL_LENGTH_PRESETS', () => {
  it('includes the chart default tail length', () => {
    expect(RRG_TAIL_LENGTH_PRESETS).toContain(RRG_CHART_DEFAULTS.tailLength)
  })
})

describe('resolveTailLengthPresets', () => {
  it('returns default presets unchanged when current is already listed', () => {
    expect(resolveTailLengthPresets(RRG_CHART_DEFAULTS.tailLength)).toEqual([
      4, 8, 10, 12, 16, 24,
    ])
  })

  it('inserts custom finite values not in the preset list', () => {
    expect(resolveTailLengthPresets(15, RRG_TAIL_LENGTH_PRESETS)).toEqual([
      4, 8, 10, 12, 15, 16, 24,
    ])
  })

  it('inserts the exact current value without flooring', () => {
    expect(resolveTailLengthPresets(10.5, [4, 8, 12])).toEqual([4, 8, 10.5, 12])
  })

  it('does not insert non-finite values', () => {
    expect(resolveTailLengthPresets(Number.NaN, [4, 8, 12])).toEqual([4, 8, 12])
    expect(resolveTailLengthPresets(Number.POSITIVE_INFINITY, [4, 8, 12])).toEqual([
      4, 8, 12,
    ])
  })

  it('deduplicates and sorts caller-provided presets', () => {
    expect(resolveTailLengthPresets(16, [24, 16, 8, 24])).toEqual([8, 16, 24])
  })
})
