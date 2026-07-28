import { isAgentModeEnabled } from './agentState'

export function isPerfPanelEnabled(search: string): boolean {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  return params.get('perf') === '1' || params.get('perf') === 'true'
}

/** Collapse power-user panels for agent visual QA and chart-first layout. */
export function applyAgentDemoShellFlags(
  search: string,
  controls: {
    customizeOpen: boolean
    advancedOpen: boolean
    snippetOpen: boolean
    copyOpen: boolean
    showSummary: boolean
  },
): void {
  if (!isAgentModeEnabled(search)) return
  controls.customizeOpen = false
  controls.advancedOpen = false
  controls.snippetOpen = false
  controls.copyOpen = false
  controls.showSummary = false
}
