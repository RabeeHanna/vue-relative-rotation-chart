import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgChart from '../src/components/RrgChart.vue'
import {
  denseClusterMock,
  farRightOutlierMock,
  missingLabelMock,
  noisyTailMock,
  singleTickerMock,
  datesForSeries,
} from '../demo/adversarialMocks'
import { computeSpatialBinLayout } from '../src/utils/labels'

describe('adversarial mocks', () => {
  it('dense cluster places visible labels without AABB fusion', () => {
    const date = datesForSeries(denseClusterMock).at(-1)!
    const wrapper = mount(RrgChart, {
      props: {
        series: denseClusterMock,
        selectedDate: date,
        width: 640,
        height: 480,
        labelMode: 'auto',
      },
    })

    const labels = wrapper.findAll('[data-testid^="rrg-label-"]')
    expect(labels.length).toBe(16)

    const pixelPoints = denseClusterMock.map((s, i) => ({
      ticker: s.ticker,
      label: s.label,
      px: 280 + (i % 4) * 8,
      py: 220 + Math.floor(i / 4) * 8,
    }))
    const layout = computeSpatialBinLayout(pixelPoints)
    const visible = layout.filter((l) => l.visible)
    for (let i = 0; i < visible.length; i++) {
      for (let j = i + 1; j < visible.length; j++) {
        const a = visible[i]
        const b = visible[j]
        const aw = a.label.length * 7
        const bw = b.label.length * 7
        const overlap = !(
          a.x + aw <= b.x ||
          b.x + bw <= a.x ||
          a.y + 12 <= b.y ||
          b.y + 12 <= a.y
        )
        expect(overlap).toBe(false)
      }
    }
  })

  it('single ticker and missing-label mocks render without throwing', async () => {
    const soloDate = datesForSeries(singleTickerMock).at(-1)!
    const solo = mount(RrgChart, {
      props: {
        series: singleTickerMock,
        selectedDate: soloDate,
        width: 640,
        height: 480,
      },
    })
    expect(solo.get('[data-testid="rrg-point-SOLO"]').exists()).toBe(true)

    const missDate = datesForSeries(missingLabelMock).at(-1)!
    const missing = mount(RrgChart, {
      props: {
        series: missingLabelMock,
        selectedDate: missDate,
        width: 640,
        height: 480,
      },
    })
    await missing.get('[data-testid="rrg-point-NLBL"] .rrg-point-hit').trigger('pointerenter')
    expect(missing.get('[data-testid="rrg-tooltip"]').text()).toContain('NLBL')
  })

  it('outlier and noisy mocks expose inspectable tails and points', () => {
    const outDate = datesForSeries(farRightOutlierMock).at(-1)!
    const outlier = mount(RrgChart, {
      props: {
        series: farRightOutlierMock,
        selectedDate: outDate,
        width: 640,
        height: 480,
        viewportMode: 'fit',
      },
    })
    expect(outlier.get('[data-testid="rrg-point-OUT"]').exists()).toBe(true)
    expect(outlier.get('[data-testid="rrg-tail-OUT"]').findAll('line').length).toBeGreaterThan(0)

    const noisyDate = datesForSeries(noisyTailMock).at(-1)!
    const noisy = mount(RrgChart, {
      props: {
        series: noisyTailMock,
        selectedDate: noisyDate,
        width: 640,
        height: 480,
      },
    })
    expect(noisy.get('[data-testid="rrg-tail-ZZY"]').findAll('line').length).toBeGreaterThan(2)
  })
})
