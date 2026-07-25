import { computed, type ComputedRef, type Ref } from 'vue'
import type { RrgDomain, RrgRenderSeries, RrgViewportMode } from '../types/rrg'
import { centerDomain, fitDomain, maxDomain } from '../utils/viewportDomain'

export type ViewportOptions = {
  centerRadius?: number
  fitPadding?: number
  maxPadding?: number
}

type MaybeRef<T> = ComputedRef<T> | Ref<T>

/**
 * Viewport domain for fit (Fit-All), max, and center modes (PRE-C1-B).
 */
export function useRrgViewport(
  series: MaybeRef<RrgRenderSeries[]>,
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
    switch (viewportMode.value) {
      case 'center':
        return centerDomain(centerRadius)
      case 'max':
        return maxDomain(series.value, maxPadding)
      case 'fit':
      default:
        return fitDomain(
          series.value,
          selectedDate.value,
          tailLength.value,
          fitPadding,
        )
    }
  })
}
