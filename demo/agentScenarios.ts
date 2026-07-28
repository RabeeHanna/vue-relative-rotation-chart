/**
 * Agent browse/click missions for the Vite demo (C24.2).
 * Consumed by the in-repo skill, docs, and `tests/e2e/agent-guide.spec.ts`.
 * Not published on npm — demo/CI only.
 */

export type AgentStepAction =
  | 'click'
  | 'hover'
  | 'fill'
  | 'select'
  | 'readState'
  | 'expectChart'
  | 'expectVisible'
  | 'pausePlayback'

export type AgentStep = {
  action: AgentStepAction
  /** `data-testid` of the target element */
  target?: string
  value?: string
  /** Partial match on `agent-state-json` after `readState` */
  expect?: Record<string, string | number | boolean>
  /** Chart root attribute check (`expectChart`) */
  attribute?: string
  /** Playwright pointer option for hover */
  force?: boolean
}

export type AgentMission = {
  id: string
  name: string
  url: string
  readyTestId: string
  steps: AgentStep[]
}

export const AGENT_MISSIONS: AgentMission[] = [
  {
    id: 'default-load',
    name: 'Default load',
    url: '/?agent=1',
    readyTestId: 'rrg-chart',
    steps: [
      { action: 'expectVisible', target: 'rrg-point-XLK' },
      { action: 'readState', expect: { scenario: 'default' } },
    ],
  },
  {
    id: 'viewport-tour',
    name: 'Viewport fit → max → center',
    url: '/?scenario=denseCluster&agent=1',
    readyTestId: 'rrg-chart',
    steps: [
      { action: 'select', target: 'demo-viewport', value: 'max' },
      {
        action: 'expectChart',
        attribute: 'data-viewport-mode',
        value: 'max',
      },
      { action: 'readState', expect: { viewportMode: 'max' } },
      { action: 'select', target: 'demo-viewport', value: 'center' },
      {
        action: 'expectChart',
        attribute: 'data-viewport-mode',
        value: 'center',
      },
    ],
  },
  {
    id: 'playback-tour',
    name: 'Playback scrub while paused',
    url: '/?scenario=longPlayback50&agent=1',
    readyTestId: 'rrg-chart',
    steps: [
      { action: 'pausePlayback' },
      { action: 'fill', target: 'rrg-playback-scrubber', value: '0' },
      { action: 'expectChart', attribute: 'data-selected-date' },
    ],
  },
  {
    id: 'label-hover',
    name: 'Hover reveals tooltip',
    url: '/?labelMode=hover&agent=1',
    readyTestId: 'rrg-chart',
    steps: [
      { action: 'hover', target: 'rrg-point-XLK' },
      { action: 'expectVisible', target: 'rrg-tooltip' },
      { action: 'readState', expect: { labelMode: 'hover' } },
    ],
  },
  {
    id: 'stress-hover',
    name: 'Stress scenario hover',
    url: '/?scenario=stress&agent=1',
    readyTestId: 'rrg-chart',
    steps: [
      { action: 'pausePlayback' },
      { action: 'hover', target: 'rrg-point-T0', force: true },
      { action: 'expectVisible', target: 'rrg-tooltip' },
      { action: 'hover', target: 'rrg-point-T1', force: true },
      { action: 'hover', target: 'rrg-point-T2', force: true },
      { action: 'readState', expect: { scenario: 'stress' } },
    ],
  },
]

export function agentMissionById(id: string): AgentMission | undefined {
  return AGENT_MISSIONS.find((mission) => mission.id === id)
}
