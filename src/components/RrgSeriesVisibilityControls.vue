<script setup lang="ts">
import { computed, ref } from 'vue'
import type { RrgRenderSeries } from '../types/rrg'
import { assignSeriesColors } from '../utils/colors'
import {
  hideAllTickers,
  showAllTickers,
  soloTicker,
} from '../composables/useRrgSeriesVisibility'
import './rrgControlsShared.css'
import './RrgSeriesVisibilityControls.css'

const props = withDefaults(
  defineProps<{
    series: RrgRenderSeries[]
    disabled?: boolean
    dark?: boolean
    inset?: boolean
  }>(),
  {
    disabled: false,
    dark: false,
    inset: false,
  },
)

const visibleTickers = defineModel<string[]>('visibleTickers', { required: true })

const coloredSeries = computed(() => assignSeriesColors(props.series))

const preSoloTickers = ref<string[] | null>(null)

const visibleSet = computed(() => new Set(visibleTickers.value))

function setVisible(next: string[]) {
  visibleTickers.value = next
}

function toggleTicker(ticker: string) {
  const next = new Set(visibleSet.value)
  if (next.has(ticker)) next.delete(ticker)
  else next.add(ticker)
  preSoloTickers.value = null
  setVisible([...next])
}

function onShowAll() {
  preSoloTickers.value = null
  setVisible(showAllTickers(props.series))
}

function onHideAll() {
  preSoloTickers.value = null
  setVisible(hideAllTickers())
}

function onSolo(ticker: string) {
  if (!preSoloTickers.value) {
    preSoloTickers.value = [...visibleTickers.value]
  }
  setVisible(soloTicker(ticker))
}

function onRestore() {
  if (!preSoloTickers.value) return
  setVisible([...preSoloTickers.value])
  preSoloTickers.value = null
}
</script>

<template>
  <div
    class="rrg-series-visibility"
    :class="[
      inset ? 'rrg-controls-surface--inset' : 'rrg-controls-surface',
      { dark },
    ]"
    data-testid="rrg-series-visibility"
    role="group"
    aria-label="Series visibility"
  >
    <div class="rrg-series-visibility__actions">
      <button
        type="button"
        data-testid="rrg-series-visibility-show-all"
        :disabled="disabled"
        @click="onShowAll"
      >
        Show all
      </button>
      <button
        type="button"
        data-testid="rrg-series-visibility-hide-all"
        :disabled="disabled"
        @click="onHideAll"
      >
        Hide all
      </button>
      <button
        type="button"
        data-testid="rrg-series-visibility-restore"
        :disabled="disabled || !preSoloTickers"
        @click="onRestore"
      >
        Restore
      </button>
    </div>

    <ul class="rrg-series-visibility__list">
      <li
        v-for="item in coloredSeries"
        :key="item.ticker"
        class="rrg-series-visibility__item"
        :class="{ 'rrg-series-visibility__item--hidden': !visibleSet.has(item.ticker) }"
        :data-testid="`rrg-series-visibility-item-${item.ticker}`"
      >
        <span
          class="rrg-series-visibility__swatch"
          :style="{ background: item.color }"
          :data-testid="`rrg-series-visibility-swatch-${item.ticker}`"
          aria-hidden="true"
        />
        <label>
          <input
            type="checkbox"
            :checked="visibleSet.has(item.ticker)"
            :disabled="disabled"
            :data-testid="`rrg-series-visibility-check-${item.ticker}`"
            @change="toggleTicker(item.ticker)"
          />
          {{ item.label || item.ticker }}
        </label>
        <button
          type="button"
          class="rrg-series-visibility__solo"
          :data-testid="`rrg-series-visibility-solo-${item.ticker}`"
          :disabled="disabled"
          @click="onSolo(item.ticker)"
        >
          Solo
        </button>
      </li>
    </ul>
  </div>
</template>
