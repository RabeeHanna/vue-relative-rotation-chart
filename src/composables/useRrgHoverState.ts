import { computed, ref, watch, type Ref } from 'vue'
import type { RrgRenderPoint } from '../types/rrg'

/**
 * Internal pointer hover state. Click selection stays parent-owned in v1.
 * While a ticker stays hovered, `hoveredPoint` tracks the live current-frame
 * point so tooltip content stays fresh; tooltip *position* is frozen separately.
 */
export function useRrgHoverState(currentPoints?: Ref<RrgRenderPoint[]>) {
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

  if (currentPoints) {
    watch(
      currentPoints,
      (points) => {
        const ticker = hoveredTicker.value
        if (!ticker) return
        const next = points.find((p) => p.ticker === ticker)
        if (next) hoveredPoint.value = next
      },
      { flush: 'sync' },
    )
  }

  return {
    hoveredTicker: computed(() => hoveredTicker.value),
    hoveredPoint: computed(() => hoveredPoint.value),
    onPointEnter,
    onPointLeave,
    onPointClick,
  }
}
