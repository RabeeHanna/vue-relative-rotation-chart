import { describe, expect, it, vi } from 'vitest'
import { computed, ref } from 'vue'
import { useSeriesIndex } from '../src/composables/useSeriesIndex'
import * as seriesIndexModule from '../src/utils/seriesIndex'
import { getPointAtDate } from '../src/utils/seriesIndex'
import { fitDomain, fitDomainFromIndex, maxDomain, maxDomainFromIndex } from '../src/utils/viewportDomain'
import { mockSeries } from '../src/scenarios/mockSeries'
import type { RrgRenderSeries } from '../src/types/rrg'

const sparseSeries: RrgRenderSeries[] = [
  {
    ticker: 'A',
    label: 'A',
    points: [
      { date: '2024-01-01', x: 101, y: 102, quadrant: 'leading' },
      { date: '2024-01-15', x: 103, y: 104, quadrant: 'leading' },
    ],
  },
  {
    ticker: 'B',
    label: 'B',
    points: [
      { date: '2024-01-10', x: 98, y: 99, quadrant: 'lagging' },
      { date: '2024-02-01', x: 97, y: 96, quadrant: 'lagging' },
    ],
  },
]

describe('buildSeriesIndex', () => {
  it('builds sorted date union across sparse visible series', () => {
    const index = seriesIndexModule.buildSeriesIndex(sparseSeries)
    expect(index.dates).toEqual(['2024-01-01', '2024-01-10', '2024-01-15', '2024-02-01'])
  })

  it('looks up points by date in O(1) per series', () => {
    const index = seriesIndexModule.buildSeriesIndex(sparseSeries)
    const entry = index.byTicker.get('B')!
    expect(getPointAtDate(entry, '2024-01-10')).toMatchObject({ x: 98, y: 99 })
    expect(getPointAtDate(entry, '2024-06-01')).toBeUndefined()
  })

  it('matches legacy domain extrema for scenario fixtures', () => {
    const series = mockSeries as RrgRenderSeries[]
    const index = seriesIndexModule.buildSeriesIndex(series)
    expect(maxDomainFromIndex(index, 2)).toEqual(maxDomain(series, 2))
    expect(fitDomainFromIndex(index, '2024-03-01', 5, 5)).toEqual(
      fitDomain(series, '2024-03-01', 5, 5),
    )
  })

  it('excludes hidden series from date union and max bounds', () => {
    const withHidden: RrgRenderSeries[] = [
      ...sparseSeries,
      {
        ticker: 'HIDDEN',
        label: 'HIDDEN',
        visible: false,
        points: [{ date: '2099-01-01', x: 200, y: 40, quadrant: 'weakening' }],
      },
    ]
    const visibleOnly = seriesIndexModule.buildSeriesIndex(sparseSeries)
    const withHiddenIndex = seriesIndexModule.buildSeriesIndex(withHidden)
    expect(withHiddenIndex.dates).toEqual(visibleOnly.dates)
    expect(maxDomainFromIndex(withHiddenIndex, 0)).toEqual(maxDomainFromIndex(visibleOnly, 0))
  })
})

describe('useSeriesIndex memoization', () => {
  it('rebuilds only when the series array reference changes', () => {
    const buildSpy = vi.spyOn(seriesIndexModule, 'buildSeriesIndex')
    const seriesRef = ref(sparseSeries)
    const index = useSeriesIndex(seriesRef)

    expect(index.value.dates).toHaveLength(4)
    expect(buildSpy).toHaveBeenCalledTimes(1)

    seriesRef.value = sparseSeries
    expect(index.value.dates).toHaveLength(4)
    expect(buildSpy).toHaveBeenCalledTimes(1)

    seriesRef.value = [...sparseSeries]
    expect(index.value.dates).toHaveLength(4)
    expect(buildSpy).toHaveBeenCalledTimes(2)

    buildSpy.mockRestore()
  })

  it('does not rebuild when only selectedDate changes', () => {
    const buildSpy = vi.spyOn(seriesIndexModule, 'buildSeriesIndex')
    const seriesRef = ref(sparseSeries)
    const selectedDate = ref('2024-01-01')
    const index = useSeriesIndex(seriesRef)

    const domain = computed(() =>
      fitDomainFromIndex(index.value, selectedDate.value, 2, 0),
    )

    expect(domain.value.xMax).toBeGreaterThan(100)
    expect(buildSpy).toHaveBeenCalledTimes(1)

    selectedDate.value = '2024-02-01'
    expect(domain.value.xMin).toBeLessThanOrEqual(100)
    expect(buildSpy).toHaveBeenCalledTimes(1)

    buildSpy.mockRestore()
  })
})
