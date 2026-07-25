import { computed, ref } from 'vue'
import type { RrgRenderPoint } from '../types/rrg'

/**
 * Internal pointer hover state. Click selection stays parent-owned in v1.
 */
export function useRrgHoverState() {
  const hoveredTicker = ref<string | null>(null)
  const hoveredPoint = ref<RrgRenderPoint | null>(null)

  function onPointEnter(point: RrgRenderPoint) {
    hoveredTicker.value = point.ticker
    hoveredPoint.value = point
  }

  function onPointLeave() {
    hoveredTicker.value = null
    hoveredPoint.value = null
  }

  function onPointClick(_point: RrgRenderPoint) {
    // Parent owns selection via emitted pointClick — no internal lock in v1.
  }

  return {
    hoveredTicker: computed(() => hoveredTicker.value),
    hoveredPoint: computed(() => hoveredPoint.value),
    onPointEnter,
    onPointLeave,
    onPointClick,
  }
}
