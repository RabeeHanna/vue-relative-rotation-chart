import { type Ref, watch } from 'vue'
import type { DemoControlsState } from './demoControlsState'
import { applyScenarioPreset, writeDemoSession } from './demoSession'
import { themeCssDefaults } from './demoThemeCss'
import { syncDemoUrl } from './syncDemoUrl'
import type { RrgRenderSeries } from '../src/types/rrg'

export function watchDemoSideEffects(options: {
  controls: Ref<DemoControlsState>
  dates: Ref<string[]>
  selectedDate: Ref<string>
  speed: Ref<number>
  overrideSeries: Ref<RrgRenderSeries[] | null>
}) {
  const { controls, dates, selectedDate, speed, overrideSeries } = options

  function persistSession() {
    writeDemoSession({
      controls: controls.value,
      playback: { speed: speed.value, selectedDate: selectedDate.value },
    })
  }

  watch(dates, (next) => {
    if (!next.includes(selectedDate.value)) {
      selectedDate.value = next[next.length - 1] ?? ''
    }
  })
  watch(
    () => controls.value.scenario,
    () => {
      applyScenarioPreset(controls.value)
      overrideSeries.value = null
    },
  )
  watch(
    () => controls.value.theme,
    (theme, prev) => {
      if (prev === undefined) return
      Object.assign(controls.value, themeCssDefaults(theme))
    },
  )
  watch(
    controls,
    () => {
      syncDemoUrl(controls.value)
      persistSession()
    },
    { deep: true },
  )
  watch([speed, selectedDate], persistSession)
}
