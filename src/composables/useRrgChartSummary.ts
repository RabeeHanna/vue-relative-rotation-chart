import { computed, type ComputedRef, type Ref } from 'vue'
import type { RrgQuadrant, RrgRenderPoint, RrgViewportMode } from '../types/rrg'

type MaybeRef<T> = ComputedRef<T> | Ref<T>

/**
 * Accessible SVG title/desc text for the chart.
 */
export function useRrgChartSummary(
  selectedDate: MaybeRef<string>,
  viewportMode: MaybeRef<RrgViewportMode>,
  currentPoints: MaybeRef<RrgRenderPoint[]>,
): {
  title: ComputedRef<string>
  description: ComputedRef<string>
} {
  const title = computed(
    () => `Relative Rotation Chart — ${selectedDate.value}`,
  )

  const description = computed(() => {
    const points = currentPoints.value
    const byQuadrant = (q: RrgQuadrant) =>
      points
        .filter((p) => p.quadrant === q)
        .map((p) => p.ticker)
        .join(', ') || 'none'

    return [
      `RRG chart showing ${points.length} tickers as of ${selectedDate.value}.`,
      `Viewport mode: ${viewportMode.value}.`,
      `Leading quadrant: ${byQuadrant('leading')}.`,
      `Improving quadrant: ${byQuadrant('improving')}.`,
    ].join(' ')
  })

  return { title, description }
}
