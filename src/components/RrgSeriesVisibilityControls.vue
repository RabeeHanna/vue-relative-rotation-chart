<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { RrgRenderSeries } from '../types/rrg'
import type { ResolvedRrgControlsCopy } from '../types/controlsCopy'
import { RRG_CONTROLS_COPY_DEFAULTS } from '../types/controlsCopy'
import { assignSeriesColors } from '../utils/colors'
import {
  filterVisibleTickers,
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
    controlsCopy?: ResolvedRrgControlsCopy
  }>(),
  {
    disabled: false,
    dark: false,
    inset: false,
    controlsCopy: () => RRG_CONTROLS_COPY_DEFAULTS,
  },
)

const visibleTickers = defineModel<string[]>('visibleTickers', { required: true })

const coloredSeries = computed(() => assignSeriesColors(props.series))

const preSoloTickers = ref<string[] | null>(null)
let visibilityPatchFromControl = false

const visibleSet = computed(() => new Set(visibleTickers.value))

function setVisible(next: string[]) {
  visibilityPatchFromControl = true
  visibleTickers.value = next
  queueMicrotask(() => {
    visibilityPatchFromControl = false
  })
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
  setVisible(filterVisibleTickers(preSoloTickers.value, props.series))
  preSoloTickers.value = null
}

watch(
  () => props.series,
  (next) => {
    preSoloTickers.value = null
    const filtered = filterVisibleTickers(visibleTickers.value, next)
    if (
      filtered.length !== visibleTickers.value.length ||
      filtered.some((ticker, index) => ticker !== visibleTickers.value[index])
    ) {
      setVisible(filtered.length > 0 ? filtered : showAllTickers(next))
    }
  },
)

watch(visibleTickers, () => {
  if (!visibilityPatchFromControl) {
    preSoloTickers.value = null
  }
})
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
    :aria-label="controlsCopy.visibilityGroup"
  >
    <div class="rrg-series-visibility__actions">
      <button
        type="button"
        data-testid="rrg-series-visibility-show-all"
        :disabled="disabled"
        @click="onShowAll"
      >
        {{ controlsCopy.showAll }}
      </button>
      <button
        type="button"
        data-testid="rrg-series-visibility-hide-all"
        :disabled="disabled"
        @click="onHideAll"
      >
        {{ controlsCopy.hideAll }}
      </button>
      <button
        type="button"
        data-testid="rrg-series-visibility-restore"
        :disabled="disabled || !preSoloTickers"
        @click="onRestore"
      >
        {{ controlsCopy.restore }}
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
          {{ controlsCopy.solo }}
        </button>
      </li>
    </ul>
  </div>
</template>
