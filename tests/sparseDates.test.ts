import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, ref } from 'vue'
import RrgChart from '../src/components/RrgChart.vue'
import { useRrgTailSlices } from '../src/composables/useRrgTailSlices'
import { buildSeriesIndex } from '../src/utils/seriesIndex'
import type { RrgRenderSeries } from '../src/types/rrg'

const sparseSeries: RrgRenderSeries[] = [
  {
    ticker: 'A',
    label: 'A',
    points: [
      { date: '2024-01-01', x: 101, y: 102, quadrant: 'leading' },
      { date: '2024-01-15', x: 103, y: 104, quadrant: 'leading' },
    ],
  },
  {
    ticker: 'B',
    label: 'B',
    points: [
      { date: '2024-01-10', x: 98, y: 99, quadrant: 'lagging' },
      { date: '2024-02-01', x: 97, y: 96, quadrant: 'lagging' },
    ],
  },
]

describe('sparse date rendering', () => {
  it('omits tickers without a point at the resolved selectedDate', () => {
    const index = computed(() => buildSeriesIndex(sparseSeries))
    const selectedDate = ref('2024-01-10')
    const { currentPoints } = useRrgTailSlices(index, selectedDate)

    expect(currentPoints.value.map((p) => p.ticker)).toEqual(['B'])
  })

  it('renders only tickers present at selectedDate on the chart', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series: sparseSeries,
        selectedDate: '2024-01-10',
      },
    })

    const tickers = wrapper
      .findAll('[data-testid^="rrg-point-"]')
      .map((node) => node.attributes('data-ticker'))
    expect(tickers).toEqual(['B'])
  })
})
