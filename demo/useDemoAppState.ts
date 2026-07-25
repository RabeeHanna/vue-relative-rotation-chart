import { computed, ref } from 'vue'
import type { RrgRenderPoint, RrgRenderSeries } from '../src/types/rrg'
import { useRrgChartSummary } from '../src/composables/useRrgChartSummary'
import { applyDemoJson, copyDemoText, generateDemoSeries } from './demoActions'
import { buildCopySnippet } from './copySnippet'
import { demoChartPropsFromControls, demoCurrentPoints } from './demoChartProps'
import type { DemoControlsState } from './demoControlsState'
import {
  mergeDemoControls,
  mergeDemoPlayback,
  readDemoSession,
} from './demoSession'
import { chartThemeStyle, syncThemeCssPickers } from './demoThemeCss'
import { datesForSeries, scenarioById } from './scenarios'
import { watchDemoSideEffects } from './watchDemoSideEffects'

export function useDemoAppState(search = typeof window !== 'undefined' ? window.location.search : '') {
  const saved = readDemoSession()
  const controls = ref<DemoControlsState>(mergeDemoControls(saved?.controls, search))
  Object.assign(controls.value, syncThemeCssPickers(controls.value.theme, controls.value))

  const overrideSeries = ref<RrgRenderSeries[] | null>(null)
  const series = computed(() =>
    controls.value.source === 'preset'
      ? scenarioById[controls.value.scenario].series
      : (overrideSeries.value ?? scenarioById[controls.value.scenario].series),
  )
  const dates = computed(() => datesForSeries(series.value))
  const playback = mergeDemoPlayback(
    saved?.playback,
    dates.value[dates.value.length - 1] ?? '',
  )
  const selectedDate = ref(
    dates.value.includes(playback.selectedDate)
      ? playback.selectedDate
      : (dates.value[dates.value.length - 1] ?? ''),
  )
  const playing = ref(false)
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
      tailLength: controls.value.tailLength,
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
  }
}
