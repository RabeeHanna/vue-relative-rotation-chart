import { describe, expect, it } from 'vitest'
import {
  applyScenarioPreset,
  DEMO_CONTROL_DEFAULTS,
  DEMO_SESSION_KEY,
  mergeDemoControls,
  mergeDemoPlayback,
  readDemoSession,
  writeDemoSession,
} from '../demo/demoSession'

describe('demo session', () => {
  it('round-trips controls and playback through storage', () => {
    const memory = new Map<string, string>()
    const storage = {
      getItem: (k: string) => memory.get(k) ?? null,
      setItem: (k: string, v: string) => {
        memory.set(k, v)
      },
    }

    const controls = {
      ...DEMO_CONTROL_DEFAULTS,
      theme: 'dark' as const,
      tailLength: 12,
      showTailFade: true,
      speedMode: 'skip' as const,
      cssBg: '#112233',
      advancedOpen: true,
      copyOpen: true,
      chartCopy: { ...DEMO_CONTROL_DEFAULTS.chartCopy, leading: 'Lider' },
      playbackCopy: { ...DEMO_CONTROL_DEFAULTS.playbackCopy, play: 'Go' },
    }
    writeDemoSession(
      { controls, playback: { speed: 4, selectedDate: '2024-04-19' } },
      storage,
    )
    expect(memory.has(DEMO_SESSION_KEY)).toBe(true)

    const loaded = readDemoSession(storage)
    expect(loaded?.controls.theme).toBe('dark')
    expect(loaded?.controls.tailLength).toBe(12)
    expect(loaded?.controls.showTailFade).toBe(true)
    expect(loaded?.controls.speedMode).toBe('skip')
    expect(loaded?.controls.cssBg).toBe('#112233')
    expect(loaded?.controls.advancedOpen).toBe(true)
    expect(loaded?.controls.copyOpen).toBe(true)
    expect(loaded?.controls.chartCopy.leading).toBe('Lider')
    expect(loaded?.controls.playbackCopy.play).toBe('Go')
    expect(loaded?.playback).toEqual({ speed: 4, selectedDate: '2024-04-19' })
  })

  it('lets URL override session only for present params', () => {
    const session = {
      ...DEMO_CONTROL_DEFAULTS,
      theme: 'dark' as const,
      labelMode: 'hover' as const,
      tailLength: 15,
    }
    const merged = mergeDemoControls(session, 'theme=light&scenario=stress')
    expect(merged.theme).toBe('light')
    expect(merged.scenario).toBe('stress')
    expect(merged.labelMode).toBe('hover')
    expect(merged.tailLength).toBe(15)
  })

  it('applies scenario suggested label mode when scenario is in URL', () => {
    const session = {
      ...DEMO_CONTROL_DEFAULTS,
      labelMode: 'always' as const,
    }
    const merged = mergeDemoControls(session, '?scenario=stress')
    expect(merged.labelMode).toBe('hover')
  })

  it('keeps sibling knobs when applying a scenario preset', () => {
    const controls = {
      ...DEMO_CONTROL_DEFAULTS,
      viewportMode: 'center' as const,
      labelMode: 'always' as const,
      showTailFade: true,
      scenario: 'default' as const,
    }
    applyScenarioPreset(controls)
    expect(controls.source).toBe('preset')
    expect(controls.viewportMode).toBe('center')
    expect(controls.labelMode).toBe('always')
    expect(controls.showTailFade).toBe(true)
  })

  it('merges playback with fallbacks', () => {
    expect(mergeDemoPlayback(undefined, '2024-01-01')).toEqual({
      speed: 2,
      selectedDate: '2024-01-01',
    })
    expect(mergeDemoPlayback({ speed: 3.5, selectedDate: '2024-06-01' }, 'x')).toEqual({
      speed: 3.5,
      selectedDate: '2024-06-01',
    })
  })
})
