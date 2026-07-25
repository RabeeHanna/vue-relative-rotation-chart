<script setup lang="ts">
import type { RrgLabelMode, RrgViewportMode } from '../src/types/rrg'
import { scenarioCatalog } from './scenarios'
import type { ChartSizePreset } from './demoUrl'
import type { DemoControlsState } from './demoControlsState'
import DemoAdvanced from './DemoAdvanced.vue'
import './DemoControls.css'

const state = defineModel<DemoControlsState>({ required: true })

defineProps<{
  snippet: string
  summaryTitle: string
  summaryDesc: string
  dataNotInLink: boolean
}>()

const emit = defineEmits<{
  copySnippet: []
  copyData: []
  applyJson: []
  generate: []
}>()

const viewports: RrgViewportMode[] = ['fit', 'max', 'center']
const labels: RrgLabelMode[] = ['auto', 'always', 'hover']
const sizes: ChartSizePreset[] = ['compact', 'default', 'wide']
</script>

<template>
  <section class="demo-controls" data-testid="demo-controls">
    <div class="row tier1">
      <label>
        Scenario
        <select v-model="state.scenario" data-testid="demo-scenario">
          <option v-for="s in scenarioCatalog" :key="s.id" :value="s.id">
            {{ s.displayName }}
          </option>
        </select>
      </label>
      <label>
        Viewport
        <select v-model="state.viewportMode" data-testid="demo-viewport" :disabled="state.compare">
          <option v-for="v in viewports" :key="v" :value="v">{{ v }}</option>
        </select>
      </label>
      <label>
        Labels
        <select v-model="state.labelMode" data-testid="demo-label-mode">
          <option v-for="l in labels" :key="l" :value="l">{{ l }}</option>
        </select>
      </label>
      <label>
        Tail
        <input
          v-model.number="state.tailLength"
          type="number"
          min="1"
          max="60"
          :disabled="state.fullHistoryTail"
          data-testid="demo-tail-length"
        />
      </label>
      <label class="check">
        <input
          v-model="state.fullHistoryTail"
          type="checkbox"
          data-testid="demo-full-history-tail"
        />
        Full history
      </label>
      <label>
        Theme
        <select v-model="state.theme" data-testid="demo-theme">
          <option value="light">light</option>
          <option value="dark">dark</option>
        </select>
      </label>
      <label>
        Size
        <select v-model="state.size" data-testid="demo-size">
          <option v-for="s in sizes" :key="s" :value="s">{{ s }}</option>
        </select>
      </label>
    </div>

    <div class="row actions">
      <button type="button" data-testid="demo-copy-snippet" @click="emit('copySnippet')">
        Copy component snippet
      </button>
      <button
        type="button"
        data-testid="demo-toggle-summary"
        @click="state.showSummary = !state.showSummary"
      >
        Accessible summary {{ state.showSummary ? '▾' : '▸' }}
      </button>
      <label class="check">
        <input
          v-model="state.tickerLabelAlwaysVisible"
          type="checkbox"
          data-testid="demo-labels-always"
        />
        Always labels
      </label>
      <label class="check">
        <input v-model="state.showTailFade" type="checkbox" data-testid="demo-tail-fade" />
        Tail fade
      </label>
      <label class="check">
        <input v-model="state.playbackLoop" type="checkbox" data-testid="demo-playback-loop" />
        Loop playback
      </label>
    </div>

    <p v-if="dataNotInLink" class="notice" data-testid="demo-data-not-in-link">
      Data not in link — re-paste or re-generate
    </p>

    <div v-if="state.showSummary" class="summary">
      <p data-testid="demo-a11y-title"><strong>{{ summaryTitle }}</strong></p>
      <p data-testid="demo-a11y-desc">{{ summaryDesc }}</p>
    </div>

    <pre class="snippet" data-testid="demo-snippet">{{ snippet }}</pre>

    <DemoAdvanced
      v-model="state"
      @apply-json="emit('applyJson')"
      @generate="emit('generate')"
      @copy-data="emit('copyData')"
    />
  </section>
</template>
