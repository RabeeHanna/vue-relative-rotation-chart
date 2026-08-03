import { computed, type ComputedRef, type Ref } from 'vue'
import type { RrgDomain, RrgViewportMode } from '../types/rrg'
import {
  centerDomain,
  fitDomainFromIndex,
  maxDomainFromIndex,
} from '../utils/viewportDomain'
import type { SeriesIndex } from '../utils/seriesIndex'

export type ViewportOptions = {
  centerRadius?: number
  fitPadding?: number
  maxPadding?: number
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
  const {
    centerRadius = 10,
    fitPadding = 5,
    maxPadding = 2,
  } = options

  return computed((): RrgDomain => {
    const index = seriesIndex.value
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
