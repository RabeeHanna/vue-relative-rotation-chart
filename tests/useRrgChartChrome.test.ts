import { describe, expect, it } from 'vitest'
import { computed } from 'vue'
import type { RrgRenderSeries } from '../src/types/rrg'
import { mergeChartCopy } from '../src/types/copy'
import { useRrgChartEmptyState } from '../src/composables/useRrgChartChrome'

const series: RrgRenderSeries[] = [
  {
    ticker: 'XLK',
    label: 'XLK',
    points: [{ date: '2024-01-01', x: 102, y: 101, quadrant: 'leading' }],
    visible: false,
  },
]

describe('useRrgChartEmptyState', () => {
  it('reports all-hidden when every series is hidden', () => {
    const coloredSeries = computed(() => series)
    const dateStatus = computed(() => 'exact' as const)
    const copy = computed(() => mergeChartCopy({ emptyAllHidden: 'Todo oculto' }))
    const { isEmpty, emptyReason, emptyMessage } = useRrgChartEmptyState(
      coloredSeries,
      dateStatus,
      copy,
    )
    expect(isEmpty.value).toBe(true)
    expect(emptyReason.value).toBe('all-hidden')
    expect(emptyMessage.value).toBe('Todo oculto')
  })
})
