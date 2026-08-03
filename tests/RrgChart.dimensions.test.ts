import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import RrgChart from '../src/components/RrgChart.vue'
import { RRG_DEFAULT_MARGIN } from '../src/utils/chartLayout'

const series = [
  {
    ticker: 'XLK',
    label: 'XLK',
    points: [{ date: '2024-03-01', x: 104, y: 103, quadrant: 'leading' as const }],
  },
]

const CENTER_DOMAIN_MIN = 90
const CENTER_DOMAIN_MAX = 110

function plotWidth(svgWidth: number): number {
  return svgWidth - RRG_DEFAULT_MARGIN.left - RRG_DEFAULT_MARGIN.right
}

function plotHeight(svgHeight: number): number {
  return svgHeight - RRG_DEFAULT_MARGIN.top - RRG_DEFAULT_MARGIN.bottom
}

function expectedCx(svgWidth: number, x: number): number {
  const pw = plotWidth(svgWidth)
  return ((x - CENTER_DOMAIN_MIN) / (CENTER_DOMAIN_MAX - CENTER_DOMAIN_MIN)) * pw
}

function expectedCy(svgHeight: number, y: number): number {
  const ph = plotHeight(svgHeight)
  return ph - ((y - CENTER_DOMAIN_MIN) / (CENTER_DOMAIN_MAX - CENTER_DOMAIN_MIN)) * ph
}

type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void

class MockResizeObserver {
  static instances: MockResizeObserver[] = []
  private callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
    MockResizeObserver.instances.push(this)
  }

  observe() {}

  disconnect() {}

  trigger() {
    this.callback([], this as unknown as ResizeObserver)
  }
}

function setElementSize(el: HTMLElement, width: number, height: number) {
  Object.defineProperty(el, 'clientWidth', { configurable: true, value: width })
  Object.defineProperty(el, 'clientHeight', { configurable: true, value: height })
}

describe('RrgChart dimensions', () => {
  beforeEach(() => {
    MockResizeObserver.instances = []
    vi.stubGlobal('ResizeObserver', MockResizeObserver)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('places points using scale math for explicit width and height', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        viewportMode: 'center',
        width: 800,
        height: 600,
      },
    })

    const svg = wrapper.get('[data-testid="rrg-svg-root"]')
    expect(svg.attributes('width')).toBe('800')
    expect(svg.attributes('height')).toBe('600')

    const cx = Number(wrapper.get('.rrg-point').attributes('cx'))
    const cy = Number(wrapper.get('.rrg-point').attributes('cy'))
    expect(cx).toBeCloseTo(expectedCx(800, 104), 4)
    expect(cy).toBeCloseTo(expectedCy(600, 103), 4)
  })

  it('scales point positions proportionally when explicit dimensions change', () => {
    const small = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        viewportMode: 'center',
        width: 400,
        height: 300,
      },
    })
    const large = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        viewportMode: 'center',
        width: 800,
        height: 600,
      },
    })

    const smallCx = Number(small.get('.rrg-point').attributes('cx'))
    const largeCx = Number(large.get('.rrg-point').attributes('cx'))
    expect(smallCx).toBeCloseTo(expectedCx(400, 104), 4)
    expect(largeCx).toBeCloseTo(expectedCx(800, 104), 4)
    expect(largeCx).toBeGreaterThan(smallCx)
  })

  it('uses measured height for scales when only width is explicit', async () => {
    const host = document.createElement('div')
    host.style.width = '640px'
    host.style.height = '400px'
    document.body.appendChild(host)

    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        viewportMode: 'center',
        width: 640,
      },
      attachTo: host,
    })
    await nextTick()
    const chartEl = wrapper.get('[data-testid="rrg-chart"]').element as HTMLElement
    setElementSize(chartEl, 640, 400)
    MockResizeObserver.instances[0]?.trigger()
    await nextTick()

    const svg = wrapper.get('[data-testid="rrg-svg-root"]')
    expect(svg.attributes('width')).toBe('640')
    expect(svg.attributes('height')).toBe('400')

    const cy = Number(wrapper.get('.rrg-point').attributes('cy'))
    expect(cy).toBeCloseTo(expectedCy(400, 103), 4)

    wrapper.unmount()
    document.body.removeChild(host)
  })

  it('updates svg size and point position when the host resizes', async () => {
    const host = document.createElement('div')
    host.style.width = '640px'
    host.style.height = '480px'
    document.body.appendChild(host)

    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        viewportMode: 'center',
      },
      attachTo: host,
    })
    await nextTick()
    const chartEl = wrapper.get('[data-testid="rrg-chart"]').element as HTMLElement
    setElementSize(chartEl, 640, 480)
    MockResizeObserver.instances[0]?.trigger()
    await nextTick()

    const beforeCx = Number(wrapper.get('.rrg-point').attributes('cx'))

    setElementSize(chartEl, 800, 600)
    MockResizeObserver.instances[0]?.trigger()
    await nextTick()

    const svg = wrapper.get('[data-testid="rrg-svg-root"]')
    expect(svg.attributes('width')).toBe('800')
    expect(svg.attributes('height')).toBe('600')

    const afterCx = Number(wrapper.get('.rrg-point').attributes('cx'))
    expect(afterCx).toBeCloseTo(expectedCx(800, 104), 4)
    expect(afterCx).toBeGreaterThan(beforeCx)

    wrapper.unmount()
    document.body.removeChild(host)
  })
})
