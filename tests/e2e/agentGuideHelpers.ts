import { expect, type Page } from '@playwright/test'
import type { AgentMission, AgentStep } from '../../demo/agentScenarios'

export async function waitForAgentReady(page: Page, readyTestId: string): Promise<void> {
  await expect(page.getByTestId(readyTestId)).toBeVisible({ timeout: 30_000 })
}

export async function readAgentStateJson(page: Page): Promise<Record<string, unknown>> {
  await expect(page.getByTestId('agent-state-panel')).toBeVisible()
  const text = await page.getByTestId('agent-state-json').textContent()
  expect(text).toBeTruthy()
  return JSON.parse(text!) as Record<string, unknown>
}

export async function runAgentStep(page: Page, step: AgentStep): Promise<void> {
  switch (step.action) {
    case 'click': {
      if (!step.target) throw new Error('click step requires target')
      await page.getByTestId(step.target).click()
      return
    }
    case 'hover': {
      if (!step.target) throw new Error('hover step requires target')
      await page.getByTestId(step.target).hover({ force: step.force ?? false })
      return
    }
    case 'fill': {
      if (!step.target || step.value == null) throw new Error('fill step requires target and value')
      await page.getByTestId(step.target).fill(step.value)
      return
    }
    case 'select': {
      if (!step.target || step.value == null) throw new Error('select step requires target and value')
      await page.getByTestId(step.target).selectOption(step.value)
      return
    }
    case 'pausePlayback': {
      const toggle = page.getByTestId('rrg-playback-toggle')
      const label = (await toggle.getAttribute('aria-label')) ?? ''
      if (/pause/i.test(label)) {
        await toggle.click()
      }
      return
    }
    case 'expectVisible': {
      if (!step.target) throw new Error('expectVisible step requires target')
      await expect(page.getByTestId(step.target)).toBeVisible()
      return
    }
    case 'readState': {
      if (!step.expect) return
      const state = await readAgentStateJson(page)
      for (const [key, value] of Object.entries(step.expect)) {
        expect(state[key], `agent state ${key}`).toBe(value)
      }
      return
    }
    case 'expectChart': {
      const chart = page.getByTestId('rrg-chart')
      await expect(chart).toBeVisible()
      if (!step.attribute) throw new Error('expectChart step requires attribute')
      const attr = await chart.getAttribute(step.attribute)
      if (step.value != null) {
        expect(attr).toBe(step.value)
      } else {
        expect(attr).toBeTruthy()
      }
      return
    }
    default: {
      const _exhaustive: never = step.action
      throw new Error(`Unknown step action: ${String(_exhaustive)}`)
    }
  }
}

export async function runAgentMission(page: Page, mission: AgentMission): Promise<void> {
  await page.goto(mission.url)
  await waitForAgentReady(page, mission.readyTestId)
  for (const step of mission.steps) {
    await runAgentStep(page, step)
  }
}
