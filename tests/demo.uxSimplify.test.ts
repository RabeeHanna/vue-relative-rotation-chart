import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import DemoControls from '../demo/DemoControls.vue'
import { DEMO_CONTROL_DEFAULTS } from '../demo/demoSession'

function mountControls(overrides: Partial<typeof DEMO_CONTROL_DEFAULTS> = {}) {
  return mount(DemoControls, {
    props: {
      modelValue: { ...DEMO_CONTROL_DEFAULTS, ...overrides },
      snippet: '<RrgChart />',
      summaryTitle: 'title',
      summaryDesc: 'desc',
      dataNotInLink: false,
      'onUpdate:modelValue': undefined,
    },
  })
}

describe('demo C19.5 UX simplify', () => {
  it('defaults Customize and snippet closed; Simple shows scenario + theme', () => {
    expect(DEMO_CONTROL_DEFAULTS.customizeOpen).toBe(false)
    expect(DEMO_CONTROL_DEFAULTS.snippetOpen).toBe(false)

    const w = mountControls()
    expect(w.get('[data-testid="demo-simple"]').text()).toMatch(/Scenario/)
    expect(w.get('[data-testid="demo-simple"]').text()).toMatch(/Theme/)
    expect(w.get('[data-testid="demo-simple"]').text()).not.toMatch(/Viewport/)
    expect(w.get('[data-testid="demo-customize"]').attributes('open')).toBeUndefined()
    expect(w.get('[data-testid="demo-snippet-details"]').attributes('open')).toBeUndefined()
    expect(w.get('[data-testid="demo-copy-snippet"]').isVisible()).toBe(false)
  })

  it('exposes power controls after opening Customize; snippet stays closed', async () => {
    const w = mountControls({ customizeOpen: true })
    await nextTick()
    expect(w.get('[data-testid="demo-customize"]').attributes('open')).toBeDefined()
    expect(w.get('[data-testid="demo-copy-snippet"]').isVisible()).toBe(true)
    expect(w.get('[data-testid="demo-copy-overrides"]').exists()).toBe(true)
    expect(w.get('[data-testid="demo-advanced"]').exists()).toBe(true)
    expect(w.get('[data-testid="demo-snippet-details"]').attributes('open')).toBeUndefined()
  })

  it('expands snippet on demand while copy button stays available in Customize', async () => {
    const w = mountControls({ customizeOpen: true, snippetOpen: true })
    await nextTick()
    expect(w.get('[data-testid="demo-snippet-details"]').attributes('open')).toBeDefined()
    expect(w.get('[data-testid="demo-snippet"]').text()).toContain('RrgChart')
    expect(w.get('[data-testid="demo-copy-snippet"]').isVisible()).toBe(true)
  })

  it('explains Full history override when full history is on', async () => {
    const w = mountControls({ customizeOpen: true, fullHistoryTail: true })
    await nextTick()
    expect(w.get('[data-testid="demo-tail-cluster"]').text()).toMatch(/overrides Tail length/i)
    expect(w.get('[data-testid="demo-tail-overridden"]').text()).toMatch(/overridden/i)
  })
})
