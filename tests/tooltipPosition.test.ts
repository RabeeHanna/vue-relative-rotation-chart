import { describe, expect, it } from 'vitest'
import { computeTooltipPosition } from '../src/utils/tooltipPosition'

describe('computeTooltipPosition', () => {
  it('places tooltip to the right for left-half points', () => {
    const pos = computeTooltipPosition({
      pointX: 100,
      pointY: 200,
      tooltipWidth: 160,
      tooltipHeight: 80,
      plotWidth: 500,
      plotHeight: 400,
    })
    expect(pos.x).toBe(108)
    expect(pos.y).toBe(112)
  })

  it('flips left for right-half points and stays in bounds', () => {
    const pos = computeTooltipPosition({
      pointX: 450,
      pointY: 50,
      tooltipWidth: 160,
      tooltipHeight: 80,
      plotWidth: 500,
      plotHeight: 400,
    })
    expect(pos.x).toBeLessThan(450)
    expect(pos.x).toBeGreaterThanOrEqual(0)
    expect(pos.y).toBeGreaterThanOrEqual(0)
    expect(pos.x + 160).toBeLessThanOrEqual(500)
    expect(pos.y + 80).toBeLessThanOrEqual(400)
  })
})
