<script setup lang="ts">
import type { RrgViewportMode } from '../src/types/rrg'
import { scenarioCatalog } from './scenarios'
import type { ChartSizePreset } from './demoUrl'
import type { DemoControlsState } from './demoControlsState'
import DemoAdvanced from './DemoAdvanced.vue'
import DemoCopyOverrides from './DemoCopyOverrides.vue'
import './DemoControls.css'

const state = defineModel<DemoControlsState>({ required: true })

withDefaults(
  defineProps<{
    snippet: string
    summaryTitle: string
    summaryDesc: string
    dataNotInLink: boolean
    /** `simple` = scenario/theme only; `customize` = disclosure block; `full` = both */
    section?: 'full' | 'simple' | 'customize'
  }>(),
  { section: 'full' },
)

const emit = defineEmits<{
  copySnippet: []
  copyData: []
  applyJson: []
  generate: []
}>()

const viewports: RrgViewportMode[] = ['fit', 'max', 'center']
const sizes: ChartSizePreset[] = ['compact', 'default', 'wide']
</script>

<template>
  <section
    class="demo-controls"
    data-testid="demo-controls"
    :class="{ 'demo-controls--simple': section === 'simple', 'demo-controls--customize': section === 'customize' }"
  >
    <div v-if="section !== 'customize'" class="row simple" data-testid="demo-simple">
      <label>
        Scenario
        <select v-model="state.scenario" data-testid="demo-scenario">
          <option v-for="s in scenarioCatalog" :key="s.id" :value="s.id">
            {{ s.displayName }}
          </option>
        </select>
      </label>
      <label>
        Theme
        <select v-model="state.theme" data-testid="demo-theme">
          <option value="light">light</option>
          <option value="dark">dark</option>
        </select>
      </label>
      <label>
        Viewport
        <select v-model="state.viewportMode" data-testid="demo-viewport" :disabled="state.compare">
          <option v-for="v in viewports" :key="v" :value="v">{{ v }}</option>
        </select>
      </label>
    </div>

    <details
      v-if="section !== 'simple'"
      class="customize"
      :open="state.customizeOpen"
      data-testid="demo-customize"
    >
      <summary
        data-testid="demo-customize-summary"
        @click.prevent="state.customizeOpen = !state.customizeOpen"
      >
        Customize
      </summary>

      <div class="row">
        <label>
          Size
          <select v-model="state.size" data-testid="demo-size">
            <option v-for="s in sizes" :key="s" :value="s">{{ s }}</option>
          </select>
        </label>
      </div>

      <div class="tail-cluster" data-testid="demo-tail-cluster">
        <p class="tail-help">Full history overrides Tail length.</p>
        <div class="row">
          <label class="check">
            <input
              v-model="state.fullHistoryTail"
              type="checkbox"
              data-testid="demo-full-history-tail"
            />
            Full history
          </label>
          <span
            v-if="state.fullHistoryTail"
            class="overridden-hint"
            data-testid="demo-tail-overridden"
          >
            Tail length overridden
          </span>
        </div>
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

      <details
        class="snippet-panel"
        :open="state.snippetOpen"
        data-testid="demo-snippet-details"
      >
        <summary
          data-testid="demo-snippet-summary"
          @click.prevent="state.snippetOpen = !state.snippetOpen"
        >
          Component snippet
        </summary>
        <pre class="snippet" data-testid="demo-snippet">{{ snippet }}</pre>
      </details>

      <DemoCopyOverrides v-model="state" />

      <DemoAdvanced
        v-model="state"
        @apply-json="emit('applyJson')"
        @generate="emit('generate')"
        @copy-data="emit('copyData')"
      />
    </details>
  </section>
</template>
