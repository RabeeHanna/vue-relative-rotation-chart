import type { DemoControlsState } from './demoControlsState'
import { EMPTY_CHART_COPY, EMPTY_PLAYBACK_COPY } from './demoCopyFields'
import { parseDemoUrl, type DemoUrlState } from './demoUrl'
import { scenarioCatalog } from './scenarios'

export const DEMO_SESSION_KEY = 'vrrc-demo-session'
export const DEMO_SESSION_VERSION = 1 as const

/** Playback fields persisted with controls (visible in the demo). */
export type DemoSessionPlayback = {
  speed: number
  selectedDate: string
}

export type DemoSessionState = {
  version: typeof DEMO_SESSION_VERSION
  controls: DemoControlsState
  playback: DemoSessionPlayback
}

export const DEMO_CONTROL_DEFAULTS: DemoControlsState = {
  ...parseDemoUrl(''),
  jsonText: '',
  jsonError: '',
  genTickers: 20,
  genPoints: 15,
  genSeed: 42,
  dataHint: '',
  showSummary: false,
  customizeOpen: false,
  snippetOpen: false,
  advancedOpen: false,
  copyOpen: false,
  chartCopy: { ...EMPTY_CHART_COPY },
  playbackCopy: { ...EMPTY_PLAYBACK_COPY },
  cssBg: '#242424',
  cssLabel: '#f5f5f5',
  cssGrid: '#555555',
}

const URL_KEYS: Array<keyof DemoUrlState> = [
  'scenario',
  'viewportMode',
  'labelMode',
  'theme',
  'tailLength',
  'tickerLabelAlwaysVisible',
  'showTailFade',
  'fullHistoryTail',
  'playbackLoop',
  'size',
  'compare',
  'viewportLeft',
  'viewportRight',
  'source',
  'showQuadrantLabels',
  'showGrid',
  'showAxes',
  'embedWidth',
  'highlightedTicker',
  'selectedTicker',
  'minSpeed',
  'maxSpeed',
  'pointRadius',
  'hitRadius',
  'speedMode',
  'genTickers',
  'genPoints',
  'genSeed',
]

/** Param names present in the query string (URL wins over session for these). */
export function presentUrlKeys(search: string): Set<string> {
  const raw = search.startsWith('?') ? search.slice(1) : search
  const params = new URLSearchParams(raw)
  const keys = new Set<string>()
  for (const key of params.keys()) keys.add(key)
  return keys
}

export function mergeDemoControls(
  session: Partial<DemoControlsState> | null | undefined,
  search: string,
): DemoControlsState {
  const url = parseDemoUrl(search)
  const present = presentUrlKeys(search)
  const merged: DemoControlsState = {
    ...DEMO_CONTROL_DEFAULTS,
    ...(session ?? {}),
    chartCopy: { ...EMPTY_CHART_COPY, ...(session?.chartCopy ?? {}) },
    playbackCopy: { ...EMPTY_PLAYBACK_COPY, ...(session?.playbackCopy ?? {}) },
  }
  for (const key of URL_KEYS) {
    if (present.has(key)) {
      ;(merged as Record<string, unknown>)[key] = url[key]
    }
  }
  if (present.has('scenario') && !present.has('labelMode')) {
    const meta = scenarioCatalog.find((s) => s.id === merged.scenario)
    if (meta) merged.labelMode = meta.suggestedLabelMode
  }
  return merged
}

export function mergeDemoPlayback(
  session: Partial<DemoSessionPlayback> | null | undefined,
  fallbackDate: string,
): DemoSessionPlayback {
  return {
    speed:
      typeof session?.speed === 'number' && Number.isFinite(session.speed)
        ? session.speed
        : 2,
    selectedDate:
      typeof session?.selectedDate === 'string' ? session.selectedDate : fallbackDate,
  }
}

export function readDemoSession(
  storage: Pick<Storage, 'getItem'> | null = typeof sessionStorage !== 'undefined'
    ? sessionStorage
    : null,
): DemoSessionState | null {
  if (!storage) return null
  try {
    const raw = storage.getItem(DEMO_SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as DemoSessionState
    if (parsed?.version !== DEMO_SESSION_VERSION || !parsed.controls) return null
    return parsed
  } catch {
    return null
  }
}

export function writeDemoSession(
  state: Omit<DemoSessionState, 'version'>,
  storage: Pick<Storage, 'setItem'> | null = typeof sessionStorage !== 'undefined'
    ? sessionStorage
    : null,
): void {
  if (!storage) return
  try {
    const payload: DemoSessionState = { version: DEMO_SESSION_VERSION, ...state }
    storage.setItem(DEMO_SESSION_KEY, JSON.stringify(payload))
  } catch {
    // Quota / private mode — ignore
  }
}

/** Scenario switch: series only — never overwrite sibling knobs. */
export function applyScenarioPreset(controls: DemoControlsState): void {
  controls.source = 'preset'
}
