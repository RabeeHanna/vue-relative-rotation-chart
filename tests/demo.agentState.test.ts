import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DemoAgentStatePanel from '../demo/DemoAgentStatePanel.vue'
import {
  AGENT_STATE_PANEL_VERSION,
  buildAgentDemoState,
  isAgentModeEnabled,
} from '../demo/agentState'
import { scenarioById } from '../demo/scenarios'

describe('agent demo state', () => {
  it('enables agent mode from query param', () => {
    expect(isAgentModeEnabled('?agent=1')).toBe(true)
    expect(isAgentModeEnabled('?agent=true')).toBe(true)
    expect(isAgentModeEnabled('?scenario=stress')).toBe(false)
    expect(isAgentModeEnabled('')).toBe(false)
  })

  it('builds a stable JSON snapshot shape', () => {
    const series = scenarioById.default.series
    const state = buildAgentDemoState({
      scenario: 'default',
      source: 'preset',
      selectedDate: series[0]?.points[0]?.date ?? '2024-01-01',
      viewportMode: 'fit',
      labelMode: 'auto',
      tailLength: 8,
      fullHistoryTail: false,
      series,
      playing: true,
      speed: 2,
      loop: true,
      size: 'default',
      compare: false,
      theme: 'light',
      hovered: null,
    })

    expect(state.version).toBe(AGENT_STATE_PANEL_VERSION)
    expect(state).toMatchObject({
      scenario: 'default',
      source: 'preset',
      viewportMode: 'fit',
      labelMode: 'auto',
      tailLength: 8,
      playing: true,
      speed: 2,
      loop: true,
      chartWidth: 640,
      chartHeight: 480,
      compare: false,
      theme: 'light',
      hoveredTicker: null,
    })
    expect(state.visibleTickerCount).toBeGreaterThan(0)
    expect(state.totalTickerCount).toBe(series.length)
    expect(state.selectedDate.length).toBeGreaterThan(0)
  })

  it('counts only visible series', () => {
    const series = scenarioById.default.series.map((entry, index) => ({
      ...entry,
      visible: index > 0,
    }))

    const state = buildAgentDemoState({
      scenario: 'default',
      source: 'preset',
      selectedDate: series[0]?.points[0]?.date ?? '2024-01-01',
      viewportMode: 'center',
      labelMode: 'hover',
      tailLength: 5,
      fullHistoryTail: false,
      series,
      playing: false,
      speed: 1,
      loop: false,
      size: 'compact',
      compare: false,
      theme: 'dark',
      hovered: null,
    })

    expect(state.visibleTickerCount).toBe(series.length - 1)
    expect(state.totalTickerCount).toBe(series.length)
    expect(state.chartWidth).toBe(480)
    expect(state.chartHeight).toBe(360)
  })

  it('renders agent state JSON in the panel', () => {
    const series = scenarioById.default.series
    const state = buildAgentDemoState({
      scenario: 'default',
      source: 'preset',
      selectedDate: series[0]?.points[0]?.date ?? '2024-01-01',
      viewportMode: 'fit',
      labelMode: 'auto',
      tailLength: 8,
      fullHistoryTail: false,
      series,
      playing: false,
      speed: 1,
      loop: false,
      size: 'default',
      compare: false,
      theme: 'light',
      hovered: null,
    })

    const wrapper = mount(DemoAgentStatePanel, { props: { state } })
    expect(wrapper.find('[data-testid="agent-state-panel"]').exists()).toBe(true)
    const json = wrapper.find('[data-testid="agent-state-json"]').text()
    expect(JSON.parse(json)).toMatchObject({ version: AGENT_STATE_PANEL_VERSION, scenario: 'default' })
  })
})
