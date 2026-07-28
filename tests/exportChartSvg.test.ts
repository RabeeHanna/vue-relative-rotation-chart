import { describe, expect, it } from 'vitest'
import {
  serializeSvgElement,
  svgMarkupToDataUrl,
} from '../src/utils/exportChartSvg'

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
})
