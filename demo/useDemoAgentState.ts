import { computed, type ComputedRef, type Ref } from 'vue'
import type { RrgRenderPoint, RrgRenderSeries } from '../src/types/rrg'
import { buildAgentDemoState, isAgentModeEnabled, type AgentDemoState } from './agentState'
import type { DemoControlsState } from './demoControlsState'

export function useDemoAgentState(input: {
  search: string
  controls: Ref<DemoControlsState>
  series: ComputedRef<RrgRenderSeries[]>
  selectedDate: Ref<string>
  playing: Ref<boolean>
  speed: Ref<number>
  hovered: Ref<RrgRenderPoint | null>
}) {
  const agentMode = computed(() =>
    isAgentModeEnabled(typeof window !== 'undefined' ? window.location.search : input.search),
  )

  const agentState = computed<AgentDemoState>(() =>
    buildAgentDemoState({
      scenario: input.controls.value.scenario,
      source: input.controls.value.source,
      selectedDate: input.selectedDate.value,
      viewportMode: input.controls.value.compare
        ? input.controls.value.viewportLeft
        : input.controls.value.viewportMode,
      labelMode: input.controls.value.labelMode,
      tailLength: input.controls.value.tailLength,
      fullHistoryTail: input.controls.value.fullHistoryTail,
      series: input.series.value,
      playing: input.playing.value,
      speed: input.speed.value,
      loop: input.controls.value.playbackLoop,
      size: input.controls.value.size,
      compare: input.controls.value.compare,
      theme: input.controls.value.theme,
      hovered: input.hovered.value,
    }),
  )

  return { agentMode, agentState }
}
