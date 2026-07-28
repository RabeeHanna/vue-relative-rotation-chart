import { test } from '@playwright/test'
import { AGENT_MISSIONS } from '../../demo/agentScenarios'
import { runAgentMission } from './agentGuideHelpers'

test.describe('agent guide missions (C24.3)', () => {
  for (const mission of AGENT_MISSIONS) {
    test(mission.name, async ({ page }) => {
      await runAgentMission(page, mission)
    })
  }
})
