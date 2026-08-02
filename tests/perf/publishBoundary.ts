/** Paths that must never appear in the npm tarball (local dev / CI only). */
export const NPM_EXCLUDED_PATH_FRAGMENTS = [
  'tests/perf/',
  'demo/demoperf',
  'demo/demoapp',
  'demo/agentstate',
  'demo/demoagentstatepanel',
  'demo/agentscenarios',
  '.cursor/skills/agent-visual-qa',
  'plans/c24-agent-visual-qa',
] as const

/** Strings that must not appear in published `dist/` bundles (C24 demo tooling). */
export const DIST_AGENT_QA_FORBIDDEN = [
  'agent-state-panel',
  'agent-state-json',
  'DemoAgentStatePanel',
  'buildAgentDemoState',
  'isAgentModeEnabled',
  'agent-visual-qa-rubric',
] as const
