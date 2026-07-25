<script setup lang="ts">
import type { PropType } from 'vue'
import {
  patternElementId,
  patternKindForIndex,
  type RrgPatternKind,
} from '../utils/patterns'

defineProps({
  tickers: { type: Array as PropType<string[]>, required: true },
})

function kindFor(index: number): RrgPatternKind {
  return patternKindForIndex(index)
}
</script>

<template>
  <defs data-testid="rrg-patterns">
    <pattern
      v-for="(ticker, index) in tickers"
      :id="patternElementId(ticker)"
      :key="ticker"
      :data-pattern-kind="kindFor(index)"
      width="8"
      height="8"
      patternUnits="userSpaceOnUse"
    >
      <template v-if="kindFor(index) === 'hatch-0'">
        <path d="M0 4 H8" stroke="rgba(0,0,0,0.55)" stroke-width="1.25" />
      </template>
      <template v-else-if="kindFor(index) === 'hatch-45'">
        <path d="M0 8 L8 0" stroke="rgba(0,0,0,0.55)" stroke-width="1.25" />
      </template>
      <template v-else-if="kindFor(index) === 'hatch-90'">
        <path d="M4 0 V8" stroke="rgba(0,0,0,0.55)" stroke-width="1.25" />
      </template>
      <template v-else-if="kindFor(index) === 'dots'">
        <circle cx="4" cy="4" r="1.4" fill="rgba(0,0,0,0.55)" />
      </template>
      <template v-else>
        <path d="M0 4 H8 M4 0 V8" stroke="rgba(0,0,0,0.55)" stroke-width="1.1" />
      </template>
    </pattern>
  </defs>
</template>
