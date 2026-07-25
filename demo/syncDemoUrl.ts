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
  })
  history.replaceState(null, '', `${window.location.pathname}?${qs}`)
}
