import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useRrgChartDimensions } from '../src/composables/useRrgChartDimensions'
import {
  RRG_DEFAULT_CHART_HEIGHT,
  RRG_DEFAULT_CHART_WIDTH,
  RRG_DEFAULT_MARGIN,
  RRG_MIN_CHART_HEIGHT,
} from '../src/utils/chartLayout'

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

describe('useRrgChartDimensions', () => {
  beforeEach(() => {
    MockResizeObserver.instances = []
    vi.stubGlobal('ResizeObserver', MockResizeObserver)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('uses explicit width and height props when provided', async () => {
    const Host = defineComponent({
      setup() {
        const host = ref<HTMLElement | null>(null)
        const dims = useRrgChartDimensions(host, 720, 540)
        return () =>
          h('div', { ref: host, 'data-testid': 'host' }, [
            h('span', { 'data-testid': 'size' }, `${dims.svgWidth.value}x${dims.svgHeight.value}`),
          ])
      },
    })

    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.get('[data-testid="size"]').text()).toBe('720x540')
    expect(
      720 - RRG_DEFAULT_MARGIN.left - RRG_DEFAULT_MARGIN.right,
    ).toBeGreaterThan(0)
  })

  it('measures the host when width and height props are omitted', async () => {
    const Host = defineComponent({
      setup() {
        const host = ref<HTMLElement | null>(null)
        const dims = useRrgChartDimensions(host, undefined, undefined)
        return () =>
          h(
            'div',
            {
              ref: host,
              'data-testid': 'host',
              style: { width: '500px', height: '360px' },
            },
            h('span', { 'data-testid': 'size' }, `${dims.svgWidth.value}x${dims.svgHeight.value}`),
          )
      },
    })

    const wrapper = mount(Host)
    await nextTick()
    setElementSize(wrapper.get('[data-testid="host"]').element as HTMLElement, 500, 360)
    MockResizeObserver.instances[0]?.trigger()
    await nextTick()

    expect(wrapper.get('[data-testid="size"]').text()).toBe('500x360')
  })

  it('uses measured width and explicit height when only height is provided', async () => {
    const Host = defineComponent({
      setup() {
        const host = ref<HTMLElement | null>(null)
        const dims = useRrgChartDimensions(host, undefined, 420)
        return () =>
          h(
            'div',
            {
              ref: host,
              'data-testid': 'host',
              style: { width: '480px', height: '200px' },
            },
            h('span', { 'data-testid': 'size' }, `${dims.svgWidth.value}x${dims.svgHeight.value}`),
          )
      },
    })

    const wrapper = mount(Host)
    await nextTick()
    setElementSize(wrapper.get('[data-testid="host"]').element as HTMLElement, 480, 200)
    MockResizeObserver.instances[0]?.trigger()
    await nextTick()

    expect(wrapper.get('[data-testid="size"]').text()).toBe('480x420')
  })

  it('falls back to defaults when the host has zero size', async () => {
    const Host = defineComponent({
      setup() {
        const host = ref<HTMLElement | null>(null)
        const dims = useRrgChartDimensions(host, undefined, undefined)
        return () =>
          h('div', { ref: host, 'data-testid': 'host' }, [
            h('span', { 'data-testid': 'size' }, `${dims.svgWidth.value}x${dims.svgHeight.value}`),
          ])
      },
    })

    const wrapper = mount(Host)
    await nextTick()
    MockResizeObserver.instances[0]?.trigger()
    await nextTick()

    expect(wrapper.get('[data-testid="size"]').text()).toBe(
      `${RRG_DEFAULT_CHART_WIDTH}x${Math.max(RRG_MIN_CHART_HEIGHT, RRG_DEFAULT_CHART_HEIGHT)}`,
    )
  })
})
