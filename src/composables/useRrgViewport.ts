import { computed, toValue, type ComputedRef, type MaybeRefOrGetter, type Ref } from 'vue'
import type { RrgDomain, RrgViewportMode } from '../types/rrg'
import {
  centerDomain,
  fitDomainFromIndex,
  maxDomainFromIndex,
  resolveFitPadding,
} from '../utils/viewportDomain'
import type { SeriesIndex } from '../utils/seriesIndex'

export type ViewportOptions = {
  centerRadius?: MaybeRefOrGetter<number | undefined>
  fitPadding?: MaybeRefOrGetter<number | undefined>
  maxPadding?: MaybeRefOrGetter<number | undefined>
}

type MaybeRef<T> = ComputedRef<T> | Ref<T>

/**
 * Viewport domain for fit (Fit-All), max, and center modes.
 */
export function useRrgViewport(
  seriesIndex: MaybeRef<SeriesIndex>,
  selectedDate: MaybeRef<string>,
  tailLength: MaybeRef<number>,
  viewportMode: MaybeRef<RrgViewportMode>,
  options: ViewportOptions = {},
): ComputedRef<RrgDomain> {
  return computed((): RrgDomain => {
    const index = seriesIndex.value
    const centerRadius = toValue(options.centerRadius) ?? 10
    const maxPadding = toValue(options.maxPadding) ?? 2
    const fitPadding = resolveFitPadding(toValue(options.fitPadding))
    switch (viewportMode.value) {
      case 'center':
        return centerDomain(centerRadius)
      case 'max':
        return maxDomainFromIndex(index, maxPadding)
      case 'fit':
      default:
        return fitDomainFromIndex(
          index,
          selectedDate.value,
          tailLength.value,
          fitPadding,
        )
    }
  })
}
