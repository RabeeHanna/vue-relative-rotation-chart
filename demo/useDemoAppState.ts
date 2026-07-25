import { computed, ref, watch } from 'vue'
import type { RrgRenderPoint, RrgRenderSeries } from '../src/types/rrg'
import { useRrgChartSummary } from '../src/composables/useRrgChartSummary'
import { applyDemoJson, copyDemoText, generateDemoSeries } from './demoActions'
import { buildCopySnippet } from './copySnippet'
import { demoChartProps, demoCurrentPoints } from './demoChartProps'
import { parseDemoUrl } from './demoUrl'
import type { DemoControlsState } from './demoControlsState'
import { datesForSeries, scenarioById } from './scenarios'
import { syncDemoUrl } from './syncDemoUrl'

export function useDemoAppState(search = typeof window !== 'undefined' ? window.location.search : '') {
  const initial = parseDemoUrl(search)
  const meta = scenarioById[initial.scenario]
  const controls = ref<DemoControlsState>({
    ...initial,
    jsonText: '',
    jsonError: '',
    genTickers: 20,
    genPoints: 15,
    genSeed: 42,
    dataHint: '',
    showSummary: false,
    advancedOpen: false,
    labelMode: initial.labelMode === 'auto' ? meta.suggestedLabelMode : initial.labelMode,
  })

  const overrideSeries = ref<RrgRenderSeries[] | null>(null)
  const series = computed(() =>
    controls.value.source === 'preset'
      ? scenarioById[controls.value.scenario].series
      : (overrideSeries.value ?? scenarioById[controls.value.scenario].series),
  )
  const dates = computed(() => datesForSeries(series.value))
  const selectedDate = ref(dates.value[dates.value.length - 1] ?? '')
  const playing = ref(false)
  const speed = ref(2)
  const hovered = ref<RrgRenderPoint | null>(null)
  const copyStatus = ref('')

  const hostStyle = computed(() =>
    controls.value.embedWidth
      ? { maxWidth: `${controls.value.embedWidth}px`, marginInline: 'auto' }
      : undefined,
  )
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
      showPatterns: controls.value.showPatterns,
      tickerLabelAlwaysVisible: controls.value.tickerLabelAlwaysVisible,
      showQuadrantLabels: controls.value.showQuadrantLabels,
      showGrid: controls.value.showGrid,
      showAxes: controls.value.showAxes,
      highlightedTicker: controls.value.highlightedTicker || null,
      source: controls.value.source,
      scenarioId: controls.value.scenario,
      includePlayback: true,
    }),
  )

  function propsFor(mode: typeof controls.value.viewportMode) {
    const c = controls.value
    return demoChartProps({
      series: series.value,
      selectedDate: selectedDate.value,
      labelMode: c.labelMode,
      viewportMode: mode,
      tailLength: c.tailLength,
      showPatterns: c.showPatterns,
      tickerLabelAlwaysVisible: c.tickerLabelAlwaysVisible,
      showQuadrantLabels: c.showQuadrantLabels,
      showGrid: c.showGrid,
      showAxes: c.showAxes,
      highlightedTicker: c.highlightedTicker,
      size: c.size,
    })
  }

  const singleProps = computed(() => propsFor(controls.value.viewportMode))
  const leftProps = computed(() => propsFor(controls.value.viewportLeft))
  const rightProps = computed(() => propsFor(controls.value.viewportRight))

  watch(dates, (next) => {
    if (!next.includes(selectedDate.value)) {
      selectedDate.value = next[next.length - 1] ?? ''
    }
  })
  watch(
    () => controls.value.scenario,
    (id) => {
      controls.value.source = 'preset'
      overrideSeries.value = null
      const m = scenarioById[id]
      controls.value.viewportMode = m.suggestedViewport
      controls.value.labelMode = m.suggestedLabelMode
    },
  )
  watch(controls, () => syncDemoUrl(controls.value), { deep: true })

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
