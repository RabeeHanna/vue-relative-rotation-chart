import type { RrgLabelMode, RrgViewportMode } from '../src/types/rrg'
import { isScenarioId, type ScenarioId } from './scenarios'
import type { DemoDataSource } from './copySnippet'

export type ChartSizePreset = 'compact' | 'default' | 'wide'
export type EmbedWidth = 320 | 480 | 720 | null
export type DemoSpeedMode = 'interval' | 'skip'

export type DemoUrlState = {
  scenario: ScenarioId
  viewportMode: RrgViewportMode
  labelMode: RrgLabelMode
  theme: 'light' | 'dark'
  tailLength: number
  tickerLabelAlwaysVisible: boolean
  showTailFade: boolean
  /** When true, chart uses full series history as tailLength (off by default). */
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
  speedMode: DemoSpeedMode
}

const VIEWPORTS = new Set<RrgViewportMode>(['fit', 'max', 'center'])
const LABELS = new Set<RrgLabelMode>(['auto', 'always', 'hover'])
const SIZES = new Set<ChartSizePreset>(['compact', 'default', 'wide'])
const SOURCES = new Set<DemoDataSource>(['preset', 'custom', 'generated'])
const EMBEDS = new Set([320, 480, 720])

export const CHART_SIZE_PX: Record<ChartSizePreset, { width: number; height: number }> = {
  compact: { width: 480, height: 360 },
  default: { width: 640, height: 480 },
  wide: { width: 900, height: 520 },
}

function asViewport(value: string | null, fallback: RrgViewportMode): RrgViewportMode {
  return value && VIEWPORTS.has(value as RrgViewportMode)
    ? (value as RrgViewportMode)
    : fallback
}

function asBool(value: string | null): boolean {
  return value === 'true' || value === '1'
}

function asNum(value: string | null, fallback: number, min: number, max: number): number {
  if (value == null || value === '') return fallback
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

export function parseDemoUrl(search: string): DemoUrlState {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const scenarioRaw = params.get('scenario')
  const sizeRaw = params.get('size')
  const sourceRaw = params.get('source')
  const embedRaw = Number(params.get('embedWidth'))
  const tail = Number(params.get('tailLength'))

  return {
    scenario: isScenarioId(scenarioRaw) ? scenarioRaw : 'default',
    viewportMode: asViewport(params.get('viewportMode'), 'fit'),
    labelMode:
      params.get('labelMode') && LABELS.has(params.get('labelMode') as RrgLabelMode)
        ? (params.get('labelMode') as RrgLabelMode)
        : 'auto',
    theme: params.get('theme') === 'light' ? 'light' : 'dark',
    tailLength: Number.isFinite(tail) && tail > 0 ? Math.min(60, Math.floor(tail)) : 8,
    tickerLabelAlwaysVisible: asBool(params.get('tickerLabelAlwaysVisible')),
    showTailFade: asBool(params.get('showTailFade')),
    fullHistoryTail: asBool(params.get('fullHistoryTail')),
    playbackLoop: params.get('playbackLoop') !== 'false',
    size: sizeRaw && SIZES.has(sizeRaw as ChartSizePreset) ? (sizeRaw as ChartSizePreset) : 'default',
    compare: asBool(params.get('compare')),
    viewportLeft: asViewport(params.get('viewportLeft'), 'fit'),
    viewportRight: asViewport(params.get('viewportRight'), 'center'),
    source:
      sourceRaw && SOURCES.has(sourceRaw as DemoDataSource)
        ? (sourceRaw as DemoDataSource)
        : 'preset',
    showQuadrantLabels: params.get('showQuadrantLabels') !== 'false',
    showGrid: params.get('showGrid') !== 'false',
    showAxes: params.get('showAxes') !== 'false',
    embedWidth: EMBEDS.has(embedRaw) ? (embedRaw as 320 | 480 | 720) : null,
    highlightedTicker: params.get('highlightedTicker') ?? '',
    selectedTicker: params.get('selectedTicker') ?? '',
    minSpeed: asNum(params.get('minSpeed'), 0.5, 0.25, 4),
    maxSpeed: asNum(params.get('maxSpeed'), 5, 1, 16),
    pointRadius: asNum(params.get('pointRadius'), 5.5, 2, 16),
    hitRadius: asNum(params.get('hitRadius'), 12, 4, 32),
    speedMode:
      params.get('speedMode') === 'skip' ? 'skip' : 'interval',
  }
}

export function serializeDemoUrl(state: DemoUrlState): string {
  const params = new URLSearchParams()
  params.set('scenario', state.scenario)
  params.set('viewportMode', state.viewportMode)
  params.set('labelMode', state.labelMode)
  params.set('theme', state.theme)
  params.set('tailLength', String(state.tailLength))
  params.set('tickerLabelAlwaysVisible', String(state.tickerLabelAlwaysVisible))
  params.set('showTailFade', String(state.showTailFade))
  params.set('fullHistoryTail', String(state.fullHistoryTail))
  params.set('playbackLoop', String(state.playbackLoop))
  params.set('size', state.size)
  params.set('compare', String(state.compare))
  params.set('viewportLeft', state.viewportLeft)
  params.set('viewportRight', state.viewportRight)
  params.set('source', state.source)
  params.set('showQuadrantLabels', String(state.showQuadrantLabels))
  params.set('showGrid', String(state.showGrid))
  params.set('showAxes', String(state.showAxes))
  params.set('minSpeed', String(state.minSpeed))
  params.set('maxSpeed', String(state.maxSpeed))
  params.set('pointRadius', String(state.pointRadius))
  params.set('hitRadius', String(state.hitRadius))
  params.set('speedMode', state.speedMode)
  if (state.embedWidth) params.set('embedWidth', String(state.embedWidth))
  if (state.highlightedTicker) params.set('highlightedTicker', state.highlightedTicker)
  if (state.selectedTicker) params.set('selectedTicker', state.selectedTicker)
  return params.toString()
}
