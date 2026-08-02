import { describe, expect, it } from 'vitest'
import { computed } from 'vue'
import { useRrgViewport } from '../src/composables/useRrgViewport'
import { centerDomain, fitDomain, maxDomain } from '../src/utils/viewportDomain'
import type { RrgRenderSeries } from '../src/types/rrg'

const series: RrgRenderSeries[] = [
  {
    ticker: 'XLK',
    label: 'XLK',
    points: [
      { date: '2024-01-01', x: 102, y: 101, quadrant: 'leading' },
      { date: '2024-02-01', x: 103, y: 102, quadrant: 'leading' },
      { date: '2024-03-01', x: 104, y: 103, quadrant: 'leading' },
    ],
  },
  {
    ticker: 'OUT',
    label: 'OUT',
    points: [
      { date: '2024-01-01', x: 150, y: 50, quadrant: 'weakening' },
      { date: '2024-02-01', x: 148, y: 52, quadrant: 'weakening' },
      { date: '2024-03-01', x: 145, y: 60, quadrant: 'weakening' },
    ],
  },
]

describe('viewport domain helpers', () => {
  it('centerDomain is symmetric around 100', () => {
    expect(centerDomain(10)).toEqual({ xMin: 90, xMax: 110, yMin: 90, yMax: 110 })
  })

  it('maxDomain covers all dates and expands through center', () => {
    const domain = maxDomain(series, 0)
    expect(domain.xMin).toBe(100)
    expect(domain.xMax).toBe(150)
    expect(domain.yMin).toBe(50)
    expect(domain.yMax).toBe(103)
  })

  it('fitDomain includes outliers on the current+tail window (Fit-All)', () => {
    const domain = fitDomain(series, '2024-03-01', 2, 0)
    expect(domain.xMax).toBeGreaterThanOrEqual(145)
    expect(domain.yMin).toBeLessThanOrEqual(60)
  })
})

describe('useRrgViewport', () => {
  it('switches modes reactively', () => {
    const mode = computed(() => 'center' as const)
    const domain = useRrgViewport(
      computed(() => series),
      computed(() => '2024-03-01'),
      computed(() => 10),
      mode,
    )
    expect(domain.value).toEqual(centerDomain(10))
  })

  it('fit expands for outliers instead of clipping them', () => {
    const domain = useRrgViewport(
      computed(() => series),
      computed(() => '2024-03-01'),
      computed(() => 10),
      computed(() => 'fit'),
    )
    expect(domain.value.xMax).toBeGreaterThan(110)
  })
})
