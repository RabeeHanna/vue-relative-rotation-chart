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

  it('copies theme variables onto the cloned svg without an embedded stylesheet', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
      },
    })

    const host = wrapper.get('[data-testid="rrg-chart"]').element as HTMLElement
    host.style.setProperty('--rrg-bg', '#112233')

    const svg = wrapper.get('[data-testid="rrg-svg-root"]').element as SVGSVGElement
    const markup = serializeSvgElement(svg, host)

    expect(markup).not.toContain('<style')
    expect(markup).toMatch(/--rrg-bg:\s*#112233/)
    expect(markup).toContain('stroke="var(--rrg-grid')
    expect(wrapper.get('.rrg-grid-line').attributes('stroke')).toContain('var(--rrg-grid')
  })

  it('keeps svg presentation attributes on axes and quadrant labels', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 640,
        height: 480,
      },
    })

    expect(wrapper.get('.rrg-grid-line').attributes('stroke')).toContain('var(--rrg-grid')
    expect(wrapper.get('.rrg-quadrant-label').attributes('fill')).toContain(
      'var(--rrg-quadrant-label',
    )
  })

  it('serializes export markup with dimensions and theme variables', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        width: 200,
        height: 150,
      },
    })

    const host = wrapper.get('[data-testid="rrg-chart"]').element as HTMLElement
    host.style.setProperty('--rrg-label', '#445566')

    const svg = wrapper.get('[data-testid="rrg-svg-root"]').element as SVGSVGElement
    const markup = serializeSvgElement(svg, host)

    expect(markup).toContain('width="200"')
    expect(markup).toContain('height="150"')
    expect(markup).toMatch(/--rrg-label:\s*#445566/)
    expect(markup).not.toContain('<style')
  })
})
