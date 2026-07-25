import { computed, type ComputedRef, type Ref } from 'vue'
import type { RrgQuadrant, RrgRenderPoint, RrgViewportMode } from '../types/rrg'
import {
  formatCopy,
  mergeChartCopy,
  type RrgChartCopy,
  type ResolvedRrgChartCopy,
} from '../types/copy'

type MaybeRef<T> = ComputedRef<T> | Ref<T>

/**
 * Accessible SVG title/desc text for the chart.
 */
export function useRrgChartSummary(
  selectedDate: MaybeRef<string>,
  viewportMode: MaybeRef<RrgViewportMode>,
  currentPoints: MaybeRef<RrgRenderPoint[]>,
  copy?: MaybeRef<RrgChartCopy | null | undefined> | RrgChartCopy | null,
): {
  title: ComputedRef<string>
  description: ComputedRef<string>
  resolvedCopy: ComputedRef<ResolvedRrgChartCopy>
} {
  const resolvedCopy = computed(() => {
    const raw =
      copy == null
        ? undefined
        : typeof copy === 'object' && 'value' in copy
          ? copy.value
          : copy
    return mergeChartCopy(raw ?? undefined)
  })

  const title = computed(() =>
    formatCopy(resolvedCopy.value.chartTitle, { date: selectedDate.value }),
  )

  const description = computed(() => {
    const points = currentPoints.value
    const byQuadrant = (q: RrgQuadrant) =>
      points
        .filter((p) => p.quadrant === q)
        .map((p) => p.ticker)
        .join(', ') || 'none'

    return formatCopy(resolvedCopy.value.chartDescription, {
      date: selectedDate.value,
      count: points.length,
      viewport: viewportMode.value,
      leading: byQuadrant('leading'),
      improving: byQuadrant('improving'),
    })
  })

  return { title, description, resolvedCopy }
}
