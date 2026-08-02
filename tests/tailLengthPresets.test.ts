import { describe, expect, it } from 'vitest'
import { resolveTailLengthPresets } from '../src/utils/tailLengthPresets'
import { RRG_CHART_DEFAULTS, RRG_TAIL_LENGTH_PRESETS } from '../src/types/defaults'

describe('resolveTailLengthPresets', () => {
  it('inserts the chart default tail length into preset options', () => {
    expect(resolveTailLengthPresets(RRG_CHART_DEFAULTS.tailLength)).toEqual([
      4, 8, 10, 12, 16, 24,
    ])
  })

  it('inserts custom values not in the preset list', () => {
    expect(resolveTailLengthPresets(15, RRG_TAIL_LENGTH_PRESETS)).toEqual([
      4, 8, 12, 15, 16, 24,
    ])
  })

  it('does not duplicate values already present in presets', () => {
    expect(resolveTailLengthPresets(12, RRG_TAIL_LENGTH_PRESETS)).toEqual([
      4, 8, 12, 16, 24,
    ])
  })
})
