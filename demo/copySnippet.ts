import type { RrgLabelMode, RrgViewportMode } from '../src/types/rrg'
import type { ScenarioId } from './scenarios'

export type DemoDataSource = 'preset' | 'custom' | 'generated'

export type CopySnippetInput = {
  selectedDate: string
  viewportMode: RrgViewportMode
  labelMode: RrgLabelMode
  tailLength: number
  tickerLabelAlwaysVisible?: boolean
  showTailFade?: boolean
  showQuadrantLabels?: boolean
  showGrid?: boolean
  showAxes?: boolean
  highlightedTicker?: string | null
  source: DemoDataSource
  scenarioId?: ScenarioId
  includePlayback?: boolean
  playbackLoop?: boolean
}

/**
 * Primary adoption snippet. Always references `series` as a variable —
 * never inlines or truncates series JSON.
 */
export function buildCopySnippet(input: CopySnippetInput): string {
  const lines: string[] = []

  if (input.source === 'preset' && input.scenarioId) {
    lines.push(`// Fixture: ${input.scenarioId} (demo/scenarios.ts)`)
    lines.push(
      `// Prefer: import { ${input.scenarioId} } from 'vue-relative-rotation-chart/scenarios' // C14`,
    )
  } else if (input.source === 'generated') {
    lines.push('// series from seeded generator — use Copy data JSON for the payload')
  } else if (input.source === 'custom') {
    lines.push('// series from your pasted JSON')
  }

  lines.push('const selectedDate = ' + JSON.stringify(input.selectedDate))
  if (input.includePlayback) {
    lines.push('const playing = false')
    lines.push('const speed = 2')
  }

  const attrs = [
    '  :series="series"',
    '  :selected-date="selectedDate"',
    `  viewport-mode="${input.viewportMode}"`,
    `  label-mode="${input.labelMode}"`,
    `  :tail-length="${input.tailLength}"`,
  ]

  if (input.tickerLabelAlwaysVisible) attrs.push('  :ticker-label-always-visible="true"')
  if (input.showTailFade) attrs.push('  :show-tail-fade="true"')
  if (input.showQuadrantLabels === false) attrs.push('  :show-quadrant-labels="false"')
  if (input.showGrid === false) attrs.push('  :show-grid="false"')
  if (input.showAxes === false) attrs.push('  :show-axes="false"')
  if (input.highlightedTicker) {
    attrs.push(`  highlighted-ticker="${input.highlightedTicker}"`)
  }

  lines.push('<RrgChart')
  lines.push(...attrs)
  lines.push('/>')

  if (input.includePlayback) {
    lines.push('')
    lines.push('<RrgPlaybackControls')
    lines.push('  :dates="dates"')
    lines.push('  v-model:selected-date="selectedDate"')
    lines.push('  v-model:playing="playing"')
    lines.push('  v-model:speed="speed"')
    if (input.playbackLoop) lines.push('  :loop="true"')
    lines.push('/>')
  }

  return lines.join('\n')
}
