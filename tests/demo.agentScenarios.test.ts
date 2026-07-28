import { describe, expect, it } from 'vitest'
import { AGENT_MISSIONS, agentMissionById } from '../demo/agentScenarios'

describe('agent scenarios manifest', () => {
  it('defines at least five missions', () => {
    expect(AGENT_MISSIONS.length).toBeGreaterThanOrEqual(5)
  })

  it('covers default, viewport, playback, labels, and stress', () => {
    const ids = AGENT_MISSIONS.map((mission) => mission.id)
    expect(ids).toContain('default-load')
    expect(ids).toContain('viewport-tour')
    expect(ids).toContain('playback-tour')
    expect(ids).toContain('label-hover')
    expect(ids).toContain('stress-hover')
  })

  it('each mission has url, ready hook, and steps', () => {
    for (const mission of AGENT_MISSIONS) {
      expect(mission.url.startsWith('/'), mission.id).toBe(true)
      expect(mission.readyTestId.length).toBeGreaterThan(0)
      expect(mission.steps.length).toBeGreaterThan(0)
      for (const step of mission.steps) {
        if (step.action === 'readState') {
          expect(step.expect).toBeTruthy()
        }
        if (['click', 'hover', 'fill', 'select', 'expectVisible'].includes(step.action)) {
          expect(step.target, `${mission.id} ${step.action}`).toBeTruthy()
        }
      }
    }
  })

  it('looks up missions by id', () => {
    expect(agentMissionById('default-load')?.name).toMatch(/default/i)
    expect(agentMissionById('missing')).toBeUndefined()
  })
})
