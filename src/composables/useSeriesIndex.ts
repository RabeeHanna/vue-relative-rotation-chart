import { computed, shallowRef, toValue, type ComputedRef, type Ref } from 'vue'
import type { RrgRenderSeries } from '../types/rrg'
import { buildSeriesIndex, type SeriesIndex } from '../utils/seriesIndex'

type MaybeRef<T> = ComputedRef<T> | Ref<T>

/**
 * Memoize {@link buildSeriesIndex} by shallow `series` array identity.
 * Replace the `series` reference when data changes (see `RrgChartProps` JSDoc).
 */
export function useSeriesIndex(
  series: MaybeRef<RrgRenderSeries[]>,
): ComputedRef<SeriesIndex> {
  const cache = shallowRef<{ source: RrgRenderSeries[]; index: SeriesIndex } | null>(null)

  return computed(() => {
    const source = toValue(series)
    if (cache.value?.source === source) return cache.value.index
    const index = buildSeriesIndex(source)
    cache.value = { source, index }
    return index
  })
}
