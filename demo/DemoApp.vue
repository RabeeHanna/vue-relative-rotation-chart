<script setup lang="ts">
import { ref } from 'vue'
import {
  RrgChart,
  RrgPlaybackControls,
  type RrgRenderPoint,
} from '../src'
import { mockDates, mockSelectedDate, mockSeries } from './mockSeries'

const selectedDate = ref(mockSelectedDate)
const playing = ref(false)
const speed = ref(2)
const hovered = ref<RrgRenderPoint | null>(null)
</script>

<template>
  <main class="demo">
    <header>
      <h1>vue-relative-rotation-chart</h1>
      <p>Renderer only — data and calculations are supplied by the caller.</p>
    </header>
    <RrgChart
      :series="mockSeries"
      :selected-date="selectedDate"
      @point-hover="hovered = $event"
      @point-leave="hovered = null"
    />
    <RrgPlaybackControls
      :dates="mockDates"
      v-model:selected-date="selectedDate"
      v-model:playing="playing"
      v-model:speed="speed"
    />
    <pre class="meta">
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

header h1 {
  margin: 0 0 0.35rem;
  font-size: 1.75rem;
  letter-spacing: -0.02em;
}

header p {
  margin: 0 0 1.5rem;
  color: #555;
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
