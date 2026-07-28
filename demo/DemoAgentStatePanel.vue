<script setup lang="ts">
import { computed } from 'vue'
import type { AgentDemoState } from './agentState'
import './DemoAgentStatePanel.css'

const props = defineProps<{
  state: AgentDemoState
}>()

const json = computed(() => JSON.stringify(props.state, null, 2))
</script>

<template>
  <section class="agent-state" data-testid="agent-state-panel">
    <h2 class="agent-state__title">Agent state</h2>
    <p class="agent-state__hint">Machine-readable demo snapshot for browse/click QA (`?agent=1`).</p>
    <pre class="agent-state__json" data-testid="agent-state-json">{{ json }}</pre>
  </section>
</template>
