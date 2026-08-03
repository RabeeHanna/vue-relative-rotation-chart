import type { Ref } from 'vue'
import type { RrgRenderPoint } from '../types/rrg'

type HoverApi = {
  onPointEnter: (point: RrgRenderPoint) => void
  onPointLeave: () => void
  onPointClick: (point: RrgRenderPoint) => void
}

/** Point/tail pointer handoff with relatedTarget guards. */
export function useRrgChartPointer(
  currentPoints: Ref<RrgRenderPoint[]>,
  hover: HoverApi,
  emitClick: (point: RrgRenderPoint) => void,
) {
  function stillOverInteractive(related: EventTarget | null): boolean {
    if (!(related instanceof Element)) return false
    return Boolean(related.closest('.rrg-point-hit, .rrg-tail, .rrg-tail-hit'))
  }

  return {
    handlePointEnter: (point: RrgRenderPoint) => hover.onPointEnter(point),
    handlePointLeave: (event?: PointerEvent) => {
      if (event && stillOverInteractive(event.relatedTarget)) return
      hover.onPointLeave()
    },
    handleTailEnter: (ticker: string) => {
      const point = currentPoints.value.find((p) => p.ticker === ticker)
      if (point) hover.onPointEnter(point)
    },
    handleTailLeave: (event: PointerEvent) => {
      if (stillOverInteractive(event.relatedTarget)) return
      hover.onPointLeave()
    },
    handlePointClick: (point: RrgRenderPoint) => {
      hover.onPointClick(point)
      emitClick(point)
    },
    handleChartLeave: () => hover.onPointLeave(),
  }
}
