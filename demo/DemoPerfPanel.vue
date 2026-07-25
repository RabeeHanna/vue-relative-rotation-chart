<script setup lang="ts">
import { ref } from 'vue'
import { runDemoPerfSample, type DemoPerfSample } from './demoPerfSample'

const running = ref(false)
const last = ref<DemoPerfSample | null>(null)
const error = ref('')

async function run(interaction: 'scrub' | 'play') {
  if (running.value) return
  running.value = true
  error.value = ''
  try {
    last.value = await runDemoPerfSample(interaction)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    running.value = false
  }
}
</script>

<template>
  <details class="demo-perf" data-testid="demo-perf">
    <summary>Perf sample (local convenience — Playwright is source of truth)</summary>
    <p class="demo-perf__hint">
      Soft local rAF sample for DevTools pairing. Official C17 numbers come from
      <code>npm run test:perf</code>.
    </p>
    <div class="demo-perf__actions">
      <button
        type="button"
        data-testid="demo-perf-scrub"
        :disabled="running"
        @click="run('scrub')"
      >
        Sample scrub
      </button>
      <button
        type="button"
        data-testid="demo-perf-play"
        :disabled="running"
        @click="run('play')"
      >
        Sample play
      </button>
    </div>
    <p v-if="error" class="demo-perf__error" data-testid="demo-perf-error">{{ error }}</p>
    <pre
      v-if="last"
      class="demo-perf__out"
      data-testid="demo-perf-result"
    >{{ JSON.stringify(last, null, 2) }}</pre>
  </details>
</template>

<style scoped>
.demo-perf {
  margin: 0.75rem 0 1rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  background: rgba(255, 255, 255, 0.55);
  font-size: 0.85rem;
}
.demo-perf__hint {
  margin: 0.4rem 0 0.6rem;
  color: #555;
  line-height: 1.35;
}
.demo-perf__actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.demo-perf__actions button {
  font: inherit;
  padding: 0.25rem 0.6rem;
  cursor: pointer;
}
.demo-perf__out {
  margin: 0.6rem 0 0;
  padding: 0.5rem;
  overflow: auto;
  font-size: 0.75rem;
  background: #1e1e1e;
  color: #d4d4d4;
}
.demo-perf__error {
  color: #a00;
}
</style>
