import { describe, expect, it } from 'vitest'
import {
  isRrgLabelMode,
  rrgLabelModeDescription,
  RRG_LABEL_MODES,
} from '../src/utils/labelModeLabels'

describe('label mode labels', () => {
  it('lists all label modes', () => {
    expect(RRG_LABEL_MODES).toEqual(['auto', 'always', 'hover'])
    expect(isRrgLabelMode('hover')).toBe(true)
    expect(isRrgLabelMode('bogus')).toBe(false)
  })

  it('describes each mode', () => {
    for (const mode of RRG_LABEL_MODES) {
      expect(rrgLabelModeDescription(mode).length).toBeGreaterThan(4)
    }
  })
})
