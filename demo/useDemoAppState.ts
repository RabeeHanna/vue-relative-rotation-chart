import { computed, ref } from 'vue'
import type { RrgRenderPoint, RrgRenderSeries } from '../src/types/rrg'
import { useRrgChartSummary } from '../src/composables/useRrgChartSummary'
import { applyDemoJson, copyDemoText, generateDemoSeries } from './demoActions'
import { buildCopySnippet } from './copySnippet'
import { demoChartPropsFromControls, demoCurrentPoints, effectiveDemoTailLength } from './demoChartProps'
import type { DemoControlsState } from './demoControlsState'
import {
  mergeDemoControls,
  mergeDemoPlayback,
  presentUrlKeys,
  readDemoSession,
} from './demoSession'
import { chartThemeStyle, syncThemeCssPickers } from './demoThemeCss'
import { applyAgentDemoShellFlags } from './demoAgentShell'
import { datesForSeries, scenarioById } from './scenarios'
import { useDemoAgentState } from './useDemoAgentState'
import { watchDemoSideEffects } from './watchDemoSideEffects'

export function useDemoAppState(search = typeof window !== 'undefined' ? window.location.search : '') {
  const saved = readDemoSession()
  const controls = ref<DemoControlsState>(mergeDemoControls(saved?.controls, search))
  Object.assign(controls.value, syncThemeCssPickers(controls.value.theme, controls.value))
  applyAgentDemoShellFlags(search, controls.value)

  const overrideSeries = ref<RrgRenderSeries[] | null>(null)
  const urlKeys = presentUrlKeys(search)
  const bootGenerate =
    controls.value.source === 'generated' ||
    urlKeys.has('genTickers') ||
    urlKeys.has('genPoints')
  if (bootGenerate) {
    generateDemoSeries(controls.value, overrideSeries)
  }

  const series = computed(() =>
    controls.value.source === 'preset'
      ? scenarioById[controls.value.scenario].series
      : (overrideSeries.value ?? scenarioById[controls.value.scenario].series),
  )
  const dates = computed(() => datesForSeries(series.value))
  const firstDate = dates.value[0] ?? ''
  const hasSavedDate =
    typeof saved?.playback?.selectedDate === 'string' &&
    saved.playback.selectedDate.length > 0
  const playback = mergeDemoPlayback(
    saved?.playback,
    firstDate,
  )
  const selectedDate = ref(
    bootGenerate
      ? firstDate
      : dates.value.includes(playback.selectedDate)
        ? playback.selectedDate
        : firstDate,
  )
  // First visit / no saved date → play from start; otherwise still autoplay the demo.
  const playing = ref(true)
  if (!hasSavedDate && dates.value.length > 0) {
    selectedDate.value = firstDate
  }
  const speed = ref(playback.speed)
  const hovered = ref<RrgRenderPoint | null>(null)
  const copyStatus = ref('')

  const hostStyle = computed(() =>
    controls.value.embedWidth
      ? { maxWidth: `${controls.value.embedWidth}px`, marginInline: 'auto' }
      : undefined,
  )
  const themeStyle = computed(() => chartThemeStyle(controls.value.theme, controls.value))
  const dark = computed(() => controls.value.theme === 'dark')
  const dataNotInLink = computed(() => controls.value.source !== 'preset')
  const currentPoints = computed(() => demoCurrentPoints(series.value, selectedDate.value))
  const summaryMode = computed(() =>
    controls.value.compare ? controls.value.viewportLeft : controls.value.viewportMode,
  )
  const { title: summaryTitle, description: summaryDesc } = useRrgChartSummary(
    selectedDate,
    summaryMode,
    currentPoints,
  )

  const snippet = computed(() =>
    buildCopySnippet({
      selectedDate: selectedDate.value,
      viewportMode: controls.value.compare
        ? controls.value.viewportLeft
        : controls.value.viewportMode,
      labelMode: controls.value.labelMode,
      tailLength: effectiveDemoTailLength(
        controls.value.tailLength,
        controls.value.fullHistoryTail,
        series.value,
      ),
      tickerLabelAlwaysVisible: controls.value.tickerLabelAlwaysVisible,
      showTailFade: controls.value.showTailFade,
      showQuadrantLabels: controls.value.showQuadrantLabels,
      showGrid: controls.value.showGrid,
      showAxes: controls.value.showAxes,
      highlightedTicker: controls.value.highlightedTicker || null,
      source: controls.value.source,
      scenarioId: controls.value.scenario,
      includePlayback: true,
      playbackLoop: controls.value.playbackLoop,
    }),
  )

  const singleProps = computed(() =>
    demoChartPropsFromControls(
      controls.value,
      series.value,
      selectedDate.value,
      controls.value.viewportMode,
    ),
  )
  const leftProps = computed(() =>
    demoChartPropsFromControls(
      controls.value,
      series.value,
      selectedDate.value,
      controls.value.viewportLeft,
    ),
  )
  const rightProps = computed(() =>
    demoChartPropsFromControls(
      controls.value,
      series.value,
      selectedDate.value,
      controls.value.viewportRight,
    ),
  )

  watchDemoSideEffects({ controls, dates, selectedDate, speed, overrideSeries })

  const { agentMode, agentState, showPerfPanel } = useDemoAgentState({
    search,
    controls,
    series,
    selectedDate,
    playing,
    speed,
    hovered,
  })

  return {
    controls,
    series,
    dates,
    selectedDate,
    playing,
    speed,
    hovered,
    copyStatus,
    hostStyle,
    themeStyle,
    dark,
    dataNotInLink,
    summaryTitle,
    summaryDesc,
    snippet,
    singleProps,
    leftProps,
    rightProps,
    onCopySnippet: () => void copyDemoText(snippet.value, 'Snippet copied', copyStatus),
    onCopyData: () => void copyDemoText(JSON.stringify(series.value), 'Data JSON copied', copyStatus),
    onApplyJson: () => applyDemoJson(controls.value, overrideSeries),
    onGenerate: () => generateDemoSeries(controls.value, overrideSeries),
    agentMode,
    agentState,
    showPerfPanel,
  }
}
