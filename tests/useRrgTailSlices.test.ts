import { describe, expect, it } from 'vitest'
import { computed } from 'vue'
import { useRrgTailSlices } from '../src/composables/useRrgTailSlices'
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
    ticker: 'XLF',
    label: 'XLF',
    visible: false,
    points: [{ date: '2024-03-01', x: 97, y: 98, quadrant: 'lagging' }],
  },
]

describe('useRrgTailSlices currentPoints', () => {
  it('returns the point matching selectedDate', () => {
    const { currentPoints } = useRrgTailSlices(
      computed(() => series),
      computed(() => '2024-03-01'),
    )
    expect(currentPoints.value).toHaveLength(1)
    expect(currentPoints.value[0]).toMatchObject({
      ticker: 'XLK',
      x: 104,
      y: 103,
      quadrant: 'leading',
      date: '2024-03-01',
    })
  })

  it('excludes series with visible=false', () => {
    const { currentPoints } = useRrgTailSlices(
      computed(() => series),
      computed(() => '2024-03-01'),
    )
    expect(currentPoints.value.find((p) => p.ticker === 'XLF')).toBeUndefined()
  })

  it('returns empty when selectedDate is missing', () => {
    const { currentPoints } = useRrgTailSlices(
      computed(() => series),
      computed(() => '2099-01-01'),
    )
    expect(currentPoints.value).toEqual([])
  })

  it('returns empty for empty series', () => {
    const { currentPoints } = useRrgTailSlices(
      computed(() => []),
      computed(() => '2024-03-01'),
    )
    expect(currentPoints.value).toEqual([])
  })
})

describe('useRrgTailSlices tailData', () => {
  const identity = computed(() => {
    const scale = (v: number) => v
    ;(scale as { domain?: () => number[] }).domain = () => [0, 1]
    ;(scale as { range?: () => number[] }).range = () => [0, 1]
    return scale as import('../src/composables/useRrgScales').RrgScale
  })

  it('builds opacity-faded segments up to selectedDate', () => {
    const { tailData } = useRrgTailSlices(
      computed(() => series),
      computed(() => '2024-03-01'),
      computed(() => 10),
      identity,
      identity,
    )
    const xlk = tailData.value.find((t) => t.ticker === 'XLK')
    expect(xlk?.segments).toHaveLength(2)
    expect(xlk!.segments[0].opacity).toBeLessThan(xlk!.segments[1].opacity)
    expect(xlk!.segments[0].date).toBe('2024-02-01')
    expect(xlk!.segments[1].date).toBe('2024-03-01')
  })

  it('respects tailLength', () => {
    const { tailData } = useRrgTailSlices(
      computed(() => series),
      computed(() => '2024-03-01'),
      computed(() => 2),
      identity,
      identity,
    )
    expect(tailData.value.find((t) => t.ticker === 'XLK')?.segments).toHaveLength(1)
  })
})
