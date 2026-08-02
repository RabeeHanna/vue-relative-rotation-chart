import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgChart from '../src/components/RrgChart.vue'
import { serializeSvgElement, svgMarkupToDataUrl } from '../src/utils/exportChartSvg'

const series = [
  {
    ticker: 'XLK',
    label: 'XLK',
    points: [{ date: '2024-03-01', x: 104, y: 103, quadrant: 'leading' as const }],
  },
]

describe('exportChartSvg', () => {
  it('serializes svg with xmlns', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '120')
    svg.setAttribute('height', '80')
    const markup = serializeSvgElement(svg)
    expect(markup).toContain('xmlns="http://www.w3.org/2000/svg"')
    expect(markup).toContain('width="120"')
  })

  it('builds a data url from svg markup', () => {
    const url = svgMarkupToDataUrl('<svg xmlns="http://www.w3.org/2000/svg"></svg>')
    expect(url.startsWith('data:image/svg+xml;charset=utf-8,')).toBe(true)
  })

  it('embeds stylesheet and resolves dark theme variables when style host is provided', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
      },
      attrs: { class: 'dark' },
    })

    const svg = wrapper.get('[data-testid="rrg-svg-root"]').element as SVGSVGElement
    const host = wrapper.get('[data-testid="rrg-chart"]').element as HTMLElement
    const markup = serializeSvgElement(svg, host)

    expect(markup).toContain('<style')
    expect(markup).toContain('.rrg-grid-line')
    expect(markup).toContain('--rrg-bg:#242424')
    expect(markup).toContain('fill="#242424"')
    expect(markup).not.toMatch(/fill="var\(--rrg-bg/)
  })

  it('resolves light theme background on export markup', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
      },
    })

    const svg = wrapper.get('[data-testid="rrg-svg-root"]').element as SVGSVGElement
    const host = wrapper.get('[data-testid="rrg-chart"]').element as HTMLElement
    const markup = serializeSvgElement(svg, host)

    expect(markup).toContain('--rrg-bg:#ffffff')
    expect(markup).toContain('fill="#ffffff"')
  })

  it('serializes styled markup suitable for 2x rasterization', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 200,
        height: 150,
      },
    })

    const svg = wrapper.get('[data-testid="rrg-svg-root"]').element as SVGSVGElement
    const host = wrapper.get('[data-testid="rrg-chart"]').element as HTMLElement
    const markup = serializeSvgElement(svg, host)

    expect(markup).toContain('width="200"')
    expect(markup).toContain('height="150"')
    expect(markup).toContain('<style')
    expect(markup).not.toMatch(/fill="var\(--rrg-/)
  })
})
