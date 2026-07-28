import { describe, expect, it } from 'vitest'
import {
  isRrgViewportMode,
  normalizeRrgViewportMode,
  rrgViewportModeDescription,
  rrgViewportModeLabel,
} from '../src/utils/viewportLabels'

describe('viewportLabels', () => {
  it('labels and describes each viewport mode', () => {
    expect(rrgViewportModeLabel('fit')).toBe('Fit')
    expect(rrgViewportModeLabel('max')).toBe('Max')
    expect(rrgViewportModeLabel('center')).toBe('Center')
    expect(rrgViewportModeDescription('fit')).toContain('visible')
    expect(rrgViewportModeDescription('max')).toContain('outlier')
    expect(rrgViewportModeDescription('center')).toContain('(100, 100)')
  })

  it('normalizes unknown values to fit', () => {
    expect(isRrgViewportMode('max')).toBe(true)
    expect(isRrgViewportMode('wide')).toBe(false)
    expect(normalizeRrgViewportMode('center')).toBe('center')
    expect(normalizeRrgViewportMode('wide')).toBe('fit')
    expect(normalizeRrgViewportMode('wide', 'max')).toBe('max')
  })
})
