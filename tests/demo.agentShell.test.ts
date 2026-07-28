import { describe, expect, it } from 'vitest'
import { DEMO_CONTROL_DEFAULTS } from '../demo/demoSession'
import { applyAgentDemoShellFlags, isPerfPanelEnabled } from '../demo/demoAgentShell'

describe('demo agent shell', () => {
  it('enables perf panel only with ?perf=1', () => {
    expect(isPerfPanelEnabled('?agent=1')).toBe(false)
    expect(isPerfPanelEnabled('?perf=1')).toBe(true)
    expect(isPerfPanelEnabled('?perf=true')).toBe(true)
  })

  it('collapses power panels when agent mode is on', () => {
    const controls = {
      ...DEMO_CONTROL_DEFAULTS,
      customizeOpen: true,
      advancedOpen: true,
      snippetOpen: true,
      copyOpen: true,
      showSummary: true,
    }
    applyAgentDemoShellFlags('?agent=1', controls)
    expect(controls.customizeOpen).toBe(false)
    expect(controls.advancedOpen).toBe(false)
    expect(controls.snippetOpen).toBe(false)
    expect(controls.copyOpen).toBe(false)
    expect(controls.showSummary).toBe(false)
  })
})
