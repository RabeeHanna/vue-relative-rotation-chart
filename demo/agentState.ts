/**
 * Demo-only agent QA snapshot (`?agent=1`). Not built into `dist/` or published on npm.
 * Demo-only agent QA state — not published on npm.
 */
import type { RrgLabelMode, RrgRenderPoint, RrgRenderSeries, RrgViewportMode } from '../src/types/rrg'
import { effectiveDemoTailLength } from './demoChartProps'
import type { DemoDataSource } from './copySnippet'
import type { ChartSizePreset } from './demoUrl'
import { CHART_SIZE_PX } from './demoUrl'

export const AGENT_STATE_PANEL_VERSION = 1

export type AgentDemoState = {
  version: typeof AGENT_STATE_PANEL_VERSION
  scenario: string
  source: DemoDataSource
  selectedDate: string
  viewportMode: RrgViewportMode
  labelMode: RrgLabelMode
  tailLength: number
  playing: boolean
  speed: number
  loop: boolean
  visibleTickerCount: number
  totalTickerCount: number
  chartWidth: number
  chartHeight: number
  compare: boolean
  theme: 'light' | 'dark'
  hoveredTicker: string | null
}

export function isAgentModeEnabled(search: string): boolean {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const value = params.get('agent')
  return value === '1' || value === 'true'
}

export function buildAgentDemoState(input: {
  scenario: string
  source: DemoDataSource
  selectedDate: string
  viewportMode: RrgViewportMode
  labelMode: RrgLabelMode
  tailLength: number
  fullHistoryTail: boolean
  series: RrgRenderSeries[]
  playing: boolean
  speed: number
  loop: boolean
  size: ChartSizePreset
  compare: boolean
  theme: 'light' | 'dark'
  hovered: RrgRenderPoint | null
}): AgentDemoState {
  const visibleSeries = input.series.filter((series) => series.visible !== false)
  const chartSize = CHART_SIZE_PX[input.size]

  return {
    version: AGENT_STATE_PANEL_VERSION,
    scenario: input.scenario,
    source: input.source,
    selectedDate: input.selectedDate,
    viewportMode: input.viewportMode,
    labelMode: input.labelMode,
    tailLength: effectiveDemoTailLength(
      input.tailLength,
      input.fullHistoryTail,
      input.series,
    ),
    playing: input.playing,
    speed: input.speed,
    loop: input.loop,
    visibleTickerCount: visibleSeries.length,
    totalTickerCount: input.series.length,
    chartWidth: chartSize.width,
    chartHeight: chartSize.height,
    compare: input.compare,
    theme: input.theme,
    hoveredTicker: input.hovered?.ticker ?? null,
  }
}
