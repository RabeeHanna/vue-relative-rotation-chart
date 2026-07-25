import type { DemoControlsState } from './demoControlsState'
import { serializeDemoUrl } from './demoUrl'

export function syncDemoUrl(controls: DemoControlsState): void {
  if (typeof window === 'undefined') return
  const qs = serializeDemoUrl({
    scenario: controls.scenario,
    viewportMode: controls.viewportMode,
    labelMode: controls.labelMode,
    theme: controls.theme,
    tailLength: controls.tailLength,
    showPatterns: controls.showPatterns,
    tickerLabelAlwaysVisible: controls.tickerLabelAlwaysVisible,
    showTailFade: controls.showTailFade,
    playbackLoop: controls.playbackLoop,
    size: controls.size,
    compare: controls.compare,
    viewportLeft: controls.viewportLeft,
    viewportRight: controls.viewportRight,
    source: controls.source,
    showQuadrantLabels: controls.showQuadrantLabels,
    showGrid: controls.showGrid,
    showAxes: controls.showAxes,
    embedWidth: controls.embedWidth,
    highlightedTicker: controls.highlightedTicker,
    selectedTicker: controls.selectedTicker,
    minSpeed: controls.minSpeed,
    maxSpeed: controls.maxSpeed,
    pointRadius: controls.pointRadius,
    hitRadius: controls.hitRadius,
    speedMode: controls.speedMode,
  })
  history.replaceState(null, '', `${window.location.pathname}?${qs}`)
}
