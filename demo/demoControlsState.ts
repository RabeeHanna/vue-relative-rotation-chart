import type { RrgLabelMode, RrgViewportMode } from '../src/types/rrg'
import type { ChartSizePreset, EmbedWidth } from './demoUrl'
import type { DemoDataSource } from './copySnippet'
import type { ScenarioId } from './scenarios'

export type DemoControlsState = {
  scenario: ScenarioId
  viewportMode: RrgViewportMode
  labelMode: RrgLabelMode
  tailLength: number
  theme: 'light' | 'dark'
  showPatterns: boolean
  tickerLabelAlwaysVisible: boolean
  showTailFade: boolean
  fullHistoryTail: boolean
  playbackLoop: boolean
  size: ChartSizePreset
  compare: boolean
  viewportLeft: RrgViewportMode
  viewportRight: RrgViewportMode
  source: DemoDataSource
  showQuadrantLabels: boolean
  showGrid: boolean
  showAxes: boolean
  embedWidth: EmbedWidth
  highlightedTicker: string
  selectedTicker: string
  minSpeed: number
  maxSpeed: number
  pointRadius: number
  hitRadius: number
  speedMode: 'interval' | 'skip'
  cssBg: string
  cssLabel: string
  cssGrid: string
  jsonText: string
  jsonError: string
  genTickers: number
  genPoints: number
  genSeed: number
  dataHint: string
  showSummary: boolean
  advancedOpen: boolean
}
