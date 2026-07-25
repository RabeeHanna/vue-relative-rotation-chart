<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  RrgChart,
  RrgPlaybackControls,
  type RrgLabelMode,
  type RrgRenderPoint,
  type RrgViewportMode,
} from '../src'
import {
  adversarialScenarios,
  datesForSeries,
  type AdversarialScenario,
} from './adversarialMocks'

const params = new URLSearchParams(window.location.search)
const scenarioParam = params.get('scenario') as AdversarialScenario | null
const scenario = ref<AdversarialScenario>(
  scenarioParam && scenarioParam in adversarialScenarios ? scenarioParam : 'default',
)
const labelMode = ref<RrgLabelMode>(
  (params.get('labelMode') as RrgLabelMode | null) ?? 'auto',
)
const viewportMode = ref<RrgViewportMode>(
  (params.get('viewportMode') as RrgViewportMode | null) ?? 'fit',
)
const showPatterns = ref(params.get('showPatterns') === 'true')
const tickerLabelAlwaysVisible = ref(params.get('tickerLabelAlwaysVisible') === 'true')
const dark = ref(params.get('theme') === 'dark')

const series = computed(() => adversarialScenarios[scenario.value])
const dates = computed(() => datesForSeries(series.value))
const selectedDate = ref(dates.value[dates.value.length - 1] ?? '')
const playing = ref(false)
const speed = ref(2)
const hovered = ref<RrgRenderPoint | null>(null)

watch(dates, (next) => {
  if (!next.includes(selectedDate.value)) {
    selectedDate.value = next[next.length - 1] ?? ''
  }
})
</script>

<template>
  <main class="demo" :class="{ dark }">
    <header>
      <h1>vue-relative-rotation-chart</h1>
      <p>Renderer only — data and calculations are supplied by the caller.</p>
    </header>
    <label class="scenario">
      Scenario
      <select v-model="scenario" data-testid="demo-scenario">
        <option v-for="key in Object.keys(adversarialScenarios)" :key="key" :value="key">
          {{ key }}
        </option>
      </select>
    </label>
    <div class="rrg-chart-wrap" :class="{ dark }">
      <RrgChart
        :class="{ dark }"
        :series="series"
        :selected-date="selectedDate"
        :label-mode="labelMode"
        :viewport-mode="viewportMode"
        :show-patterns="showPatterns"
        :ticker-label-always-visible="tickerLabelAlwaysVisible"
        @point-hover="hovered = $event"
        @point-leave="hovered = null"
      />
    </div>
    <RrgPlaybackControls
      :dates="dates"
      v-model:selected-date="selectedDate"
      v-model:playing="playing"
      v-model:speed="speed"
    />
    <pre class="meta">
scenario={{ scenario }} · labelMode={{ labelMode }} · viewport={{ viewportMode }}
selectedDate={{ selectedDate }} · playing={{ playing }} · speed={{ speed }}x
hovered={{ hovered ? `${hovered.ticker} @ ${hovered.date}` : 'none' }}
    </pre>
  </main>
</template>

<style>
:root {
  --rrg-bg: #f7f7f5;
  --rrg-grid: #d0d0cc;
  --rrg-label: #222;
  color-scheme: light;
}

body {
  margin: 0;
  font-family: Georgia, 'Times New Roman', serif;
  background:
    radial-gradient(circle at 20% 0%, #e8efe8 0%, transparent 40%),
    linear-gradient(180deg, #f7f7f5 0%, #eceae4 100%);
  min-height: 100vh;
}

.demo {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.25rem 3rem;
}

.demo.dark {
  color: #eee;
}

header h1 {
  margin: 0 0 0.35rem;
  font-size: 1.75rem;
  letter-spacing: -0.02em;
}

header p {
  margin: 0 0 1rem;
  color: #555;
}

.scenario {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.meta {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #666;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  white-space: pre-wrap;
}

.rrg-playback {
  margin-top: 0.75rem;
}
</style>
