<script setup lang="ts">
import type { RrgViewportMode } from '../src/types/rrg'
import type { DemoControlsState } from './demoControlsState'
import DemoPowerUser from './DemoPowerUser.vue'

const state = defineModel<DemoControlsState>({ required: true })

const emit = defineEmits<{
  applyJson: []
  generate: []
  copyData: []
}>()

const viewports: RrgViewportMode[] = ['fit', 'max', 'center']
const embeds: Array<320 | 480 | 720> = [320, 480, 720]
</script>

<template>
  <details class="advanced" :open="state.advancedOpen" data-testid="demo-advanced">
    <summary @click.prevent="state.advancedOpen = !state.advancedOpen">Advanced</summary>

    <div class="adv-block">
      <h3>BYO JSON</h3>
      <textarea
        v-model="state.jsonText"
        rows="5"
        placeholder="[{&quot;ticker&quot;:&quot;XLK&quot;,&quot;label&quot;:&quot;XLK&quot;,&quot;points&quot;:[{&quot;date&quot;:&quot;2024-01-05&quot;,&quot;x&quot;:104,&quot;y&quot;:102,&quot;quadrant&quot;:&quot;leading&quot;}]}]"
        data-testid="demo-byo-json"
      />
      <p v-if="state.jsonError" class="error" data-testid="demo-byo-error">{{ state.jsonError }}</p>
      <button type="button" data-testid="demo-apply-json" @click="emit('applyJson')">Apply JSON</button>
    </div>

    <div class="adv-block">
      <h3>Generate</h3>
      <label>Tickers <input v-model.number="state.genTickers" type="number" min="1" max="100"></label>
      <label>Points <input v-model.number="state.genPoints" type="number" min="1" max="500"></label>
      <label>Seed <input v-model.number="state.genSeed" type="number" data-testid="demo-gen-seed"></label>
      <button type="button" data-testid="demo-generate" @click="emit('generate')">Generate</button>
      <button
        type="button"
        data-testid="demo-copy-data"
        :disabled="state.source !== 'generated'"
        @click="emit('copyData')"
      >
        Copy data JSON ({{ state.dataHint || '—' }})
      </button>
    </div>

    <div class="adv-block">
      <h3>Compare / embed / chrome</h3>
      <label class="check">
        <input v-model="state.compare" type="checkbox" data-testid="demo-compare">
        Side-by-side compare
      </label>
      <template v-if="state.compare">
        <label>
          Left
          <select v-model="state.viewportLeft" data-testid="demo-viewport-left">
            <option v-for="v in viewports" :key="'L' + v" :value="v">{{ v }}</option>
          </select>
        </label>
        <label>
          Right
          <select v-model="state.viewportRight" data-testid="demo-viewport-right">
            <option v-for="v in viewports" :key="'R' + v" :value="v">{{ v }}</option>
          </select>
        </label>
      </template>
      <label>
        Embed width
        <select v-model="state.embedWidth" data-testid="demo-embed-width">
          <option :value="null">off</option>
          <option v-for="w in embeds" :key="w" :value="w">{{ w }}px</option>
        </select>
      </label>
      <label class="check"><input v-model="state.showQuadrantLabels" type="checkbox"> Quadrant labels</label>
      <label class="check"><input v-model="state.showGrid" type="checkbox"> Grid</label>
      <label class="check"><input v-model="state.showAxes" type="checkbox"> Axes</label>
      <label>
        Highlight ticker
        <input v-model="state.highlightedTicker" type="text" data-testid="demo-highlight">
      </label>
    </div>

    <DemoPowerUser v-model="state" />
  </details>
</template>
