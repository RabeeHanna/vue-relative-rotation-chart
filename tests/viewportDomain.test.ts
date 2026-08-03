import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgChart from '../src/components/RrgChart.vue'
import {
  expandDomainToIncludeCenter,
  fitDomain,
  maxDomain,
  RRG_DOMAIN_CENTER,
} from '../src/utils/viewportDomain'
import type { RrgRenderSeries } from '../src/types/rrg'

function seriesAboveCenter(): RrgRenderSeries[] {
  return [
    {
      ticker: 'HIGH',
      label: 'HIGH',
      points: [
        { date: '2024-01-01', x: 105, y: 106, quadrant: 'leading' },
        { date: '2024-02-01', x: 107, y: 108, quadrant: 'leading' },
      ],
    },
  ]
}

function seriesBelowCenter(): RrgRenderSeries[] {
  return [
    {
      ticker: 'LOW',
      label: 'LOW',
      points: [
        { date: '2024-01-01', x: 92, y: 94, quadrant: 'lagging' },
        { date: '2024-02-01', x: 90, y: 91, quadrant: 'lagging' },
      ],
    },
  ]
}

function seriesSpanningCenter(): RrgRenderSeries[] {
  return [
    {
      ticker: 'MIX',
      label: 'MIX',
      points: [
        { date: '2024-01-01', x: 95, y: 105, quadrant: 'improving' },
        { date: '2024-02-01', x: 105, y: 95, quadrant: 'weakening' },
      ],
    },
  ]
}

describe('viewportDomain policy A', () => {
  it('expandDomainToIncludeCenter pulls bounds through the RRG center', () => {
    expect(
      expandDomainToIncludeCenter({ xMin: 105, xMax: 110, yMin: 106, yMax: 112 }),
    ).toEqual({
      xMin: RRG_DOMAIN_CENTER,
      xMax: 110,
      yMin: RRG_DOMAIN_CENTER,
      yMax: 112,
    })
  })

  it('fitDomain includes center for all-above-center data', () => {
    const domain = fitDomain(seriesAboveCenter(), '2024-02-01', 2, 0)
    expect(domain.xMin).toBeLessThanOrEqual(RRG_DOMAIN_CENTER)
    expect(domain.yMin).toBeLessThanOrEqual(RRG_DOMAIN_CENTER)
    expect(domain.xMax).toBeGreaterThanOrEqual(RRG_DOMAIN_CENTER)
    expect(domain.yMax).toBeGreaterThanOrEqual(RRG_DOMAIN_CENTER)
  })

  it('fitDomain includes center for all-below-center data', () => {
    const domain = fitDomain(seriesBelowCenter(), '2024-02-01', 2, 0)
    expect(domain.xMin).toBeLessThanOrEqual(RRG_DOMAIN_CENTER)
    expect(domain.yMin).toBeLessThanOrEqual(RRG_DOMAIN_CENTER)
    expect(domain.xMax).toBeGreaterThanOrEqual(RRG_DOMAIN_CENTER)
    expect(domain.yMax).toBeGreaterThanOrEqual(RRG_DOMAIN_CENTER)
  })

  it('maxDomain includes center for mixed data spanning quadrants', () => {
    const domain = maxDomain(seriesSpanningCenter(), 0)
    expect(domain.xMin).toBeLessThanOrEqual(RRG_DOMAIN_CENTER)
    expect(domain.yMin).toBeLessThanOrEqual(RRG_DOMAIN_CENTER)
    expect(domain.xMax).toBeGreaterThanOrEqual(RRG_DOMAIN_CENTER)
    expect(domain.yMax).toBeGreaterThanOrEqual(RRG_DOMAIN_CENTER)
  })

  it('maxDomain ignores hidden series like fitDomain', () => {
    const visibleOnly: RrgRenderSeries[] = [
      {
        ticker: 'VISIBLE',
        label: 'VISIBLE',
        points: [{ date: '2024-01-01', x: 102, y: 101, quadrant: 'leading' }],
      },
    ]
    const withHidden: RrgRenderSeries[] = [
      ...visibleOnly,
      {
        ticker: 'HIDDEN',
        label: 'HIDDEN',
        visible: false,
        points: [{ date: '2024-01-01', x: 200, y: 40, quadrant: 'weakening' }],
      },
    ]

    const fitVisible = fitDomain(visibleOnly, '2024-01-01', 1, 0)
    const fitWithHidden = fitDomain(withHidden, '2024-01-01', 1, 0)
    const maxVisible = maxDomain(visibleOnly, 0)
    const maxWithHidden = maxDomain(withHidden, 0)

    expect(fitWithHidden).toEqual(fitVisible)
    expect(maxWithHidden).toEqual(maxVisible)
    expect(maxWithHidden.xMax).toBeLessThan(150)
  })
})

describe('RrgChart plot clipping', () => {
  it('clips series layers to the plot rectangle', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series: [
          {
            ticker: 'OUT',
            label: 'OUT',
            points: [{ date: '2024-01-01', x: 150, y: 100, quadrant: 'weakening' }],
          },
        ],
        selectedDate: '2024-01-01',
        viewportMode: 'center',
        width: 640,
        height: 480,
      },
    })

    const clipPath = wrapper.get('[data-testid="rrg-plot-clip-path"]')
    const clipRect = wrapper.get('[data-testid="rrg-plot-clip-rect"]')
    const seriesLayer = wrapper.get('[data-testid="rrg-plot-series"]')

    expect(clipPath.element.tagName.toLowerCase()).toBe('clippath')
    expect(Number(clipRect.attributes('width'))).toBeGreaterThan(0)
    expect(Number(clipRect.attributes('height'))).toBeGreaterThan(0)
    expect(seriesLayer.attributes('clip-path')).toMatch(/^url\(#/)
    expect(wrapper.get('[data-testid="rrg-points"]').exists()).toBe(true)
  })

  it('keeps center lines at 100 when domain policy expands through center', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series: seriesAboveCenter(),
        selectedDate: '2024-02-01',
        viewportMode: 'fit',
        width: 640,
        height: 480,
      },
    })

    const centerX = wrapper.get('[data-testid="rrg-center-x"]')
    const centerY = wrapper.get('[data-testid="rrg-center-y"]')
    expect(Number(centerX.attributes('x1'))).toBe(Number(centerX.attributes('x2')))
    expect(Number(centerY.attributes('y1'))).toBe(Number(centerY.attributes('y2')))
    expect(wrapper.get('[data-testid="rrg-quadrant-leading"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="rrg-quadrant-lagging"]').exists()).toBe(true)
  })
})
