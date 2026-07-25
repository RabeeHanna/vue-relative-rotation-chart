import { describe, expect, it } from 'vitest'
import { computed } from 'vue'
import { scaleLinear } from 'd3-scale'
import { useRrgLabelLayout } from '../src/composables/useRrgLabelLayout'
import type { RrgRenderPoint } from '../src/types/rrg'
import type { RrgScale } from '../src/composables/useRrgScales'

const points: RrgRenderPoint[] = [
  { ticker: 'XLK', label: 'XLK', x: 102, y: 101, quadrant: 'leading' },
  { ticker: 'XLF', label: 'XLF', x: 101.5, y: 100.5, quadrant: 'leading' },
]

describe('useRrgLabelLayout', () => {
  const xScale = computed(
    () => scaleLinear().domain([90, 110]).range([0, 200]) as RrgScale,
  )
  const yScale = computed(
    () => scaleLinear().domain([90, 110]).range([200, 0]) as RrgScale,
  )

  it('hides all labels in hover mode unless always-visible override', () => {
    const layout = useRrgLabelLayout(
      computed(() => points),
      computed(() => 'hover'),
      xScale,
      yScale,
    )
    expect(layout.value.every((l) => !l.visible)).toBe(true)

    const forced = useRrgLabelLayout(
      computed(() => points),
      computed(() => 'hover'),
      xScale,
      yScale,
      { tickerLabelAlwaysVisible: true },
    )
    expect(forced.value.every((l) => l.visible)).toBe(true)
  })
})
