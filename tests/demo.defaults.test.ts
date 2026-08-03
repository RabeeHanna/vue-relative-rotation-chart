import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgChart from '../src/components/RrgChart.vue'
import { useDemoAppState } from '../demo/useDemoAppState'
import {
  DEMO_CONTROL_DEFAULTS,
  DEMO_SESSION_KEY,
} from '../demo/demoSession'
import { datesForSeries, scenarioById } from '../demo/scenarios'

describe('demo defaults', () => {
  it('uses dark theme and loop-on factory defaults', () => {
    expect(DEMO_CONTROL_DEFAULTS.theme).toBe('dark')
    expect(DEMO_CONTROL_DEFAULTS.playbackLoop).toBe(true)
    expect(DEMO_CONTROL_DEFAULTS.cssBg).toBe('#242424')
  })

  it('starts at the first timeline date with playback running', () => {
    const state = useDemoAppState('')
    const dates = datesForSeries(scenarioById.default.series)
    expect(dates[0]).toBeTruthy()
    expect(state.selectedDate.value).toBe(dates[0])
    expect(state.playing.value).toBe(true)
    expect(state.controls.value.playbackLoop).toBe(true)
    expect(state.controls.value.theme).toBe('dark')
  })

  it('respects a saved session selectedDate', () => {
    const dates = datesForSeries(scenarioById.default.series)
    const mid = dates[Math.min(3, dates.length - 1)]!
    const memory = new Map<string, string>()
    memory.set(
      DEMO_SESSION_KEY,
      JSON.stringify({
        version: 1,
        controls: { ...DEMO_CONTROL_DEFAULTS },
        playback: { speed: 2, selectedDate: mid },
      }),
    )
    const prev = globalThis.sessionStorage
    Object.defineProperty(globalThis, 'sessionStorage', {
      configurable: true,
      value: {
        getItem: (k: string) => memory.get(k) ?? null,
        setItem: (k: string, v: string) => memory.set(k, v),
      },
    })
    try {
      const state = useDemoAppState('')
      expect(state.selectedDate.value).toBe(mid)
      expect(state.playing.value).toBe(true)
    } finally {
      Object.defineProperty(globalThis, 'sessionStorage', {
        configurable: true,
        value: prev,
      })
    }
  })

  it('still mounts the chart with dark default theme class path', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series: scenarioById.default.series,
        selectedDate: datesForSeries(scenarioById.default.series)[0]!,
        width: 640,
        height: 480,
      },
      attrs: { class: 'dark' },
    })
    expect(wrapper.get('[data-testid="rrg-chart"]').attributes('data-date-status')).toBe(
      'exact',
    )
  })
})
