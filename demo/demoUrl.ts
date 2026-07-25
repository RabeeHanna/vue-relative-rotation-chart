import type { RrgLabelMode, RrgViewportMode } from '../src/types/rrg'
import { isScenarioId, type ScenarioId } from './scenarios'
import type { DemoDataSource } from './copySnippet'

export type ChartSizePreset = 'compact' | 'default' | 'wide'
export type EmbedWidth = 320 | 480 | 720 | null

export type DemoUrlState = {
  scenario: ScenarioId
  viewportMode: RrgViewportMode
  labelMode: RrgLabelMode
  theme: 'light' | 'dark'
  tailLength: number
  showPatterns: boolean
  tickerLabelAlwaysVisible: boolean
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
    theme: params.get('theme') === 'dark' ? 'dark' : 'light',
    tailLength: Number.isFinite(tail) && tail > 0 ? Math.min(60, Math.floor(tail)) : 8,
    showPatterns: asBool(params.get('showPatterns')),
    tickerLabelAlwaysVisible: asBool(params.get('tickerLabelAlwaysVisible')),
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
  }
}

export function serializeDemoUrl(state: DemoUrlState): string {
  const params = new URLSearchParams()
  params.set('scenario', state.scenario)
  params.set('viewportMode', state.viewportMode)
  params.set('labelMode', state.labelMode)
  params.set('theme', state.theme)
  params.set('tailLength', String(state.tailLength))
  params.set('showPatterns', String(state.showPatterns))
  params.set('tickerLabelAlwaysVisible', String(state.tickerLabelAlwaysVisible))
  params.set('size', state.size)
  params.set('compare', String(state.compare))
  params.set('viewportLeft', state.viewportLeft)
  params.set('viewportRight', state.viewportRight)
  params.set('source', state.source)
  params.set('showQuadrantLabels', String(state.showQuadrantLabels))
  params.set('showGrid', String(state.showGrid))
  params.set('showAxes', String(state.showAxes))
  if (state.embedWidth) params.set('embedWidth', String(state.embedWidth))
  if (state.highlightedTicker) params.set('highlightedTicker', state.highlightedTicker)
  return params.toString()
}
