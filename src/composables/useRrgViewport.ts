import { computed, type ComputedRef } from 'vue'
import type { RrgDomain } from '../types/rrg'

/** C3 stub domain — replaced with Fit-All / max / center logic in C8. */
export const RRG_VIEWPORT_STUB_DOMAIN: RrgDomain = {
  xMin: 90,
  xMax: 110,
  yMin: 90,
  yMax: 110,
}

/**
 * Viewport domain for the chart.
 * C3: fixed stub. C8: fit / max / center from series + selectedDate.
 */
export function useRrgViewport(): ComputedRef<RrgDomain> {
  return computed(() => ({ ...RRG_VIEWPORT_STUB_DOMAIN }))
}
