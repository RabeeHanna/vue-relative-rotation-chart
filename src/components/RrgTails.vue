<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { TailData } from '../composables/useRrgTailSlices'

const FADED_TAIL_OPACITY = 0.2
/** Invisible hit stroke width (px) — pointer convenience only. */
const TAIL_HIT_WIDTH = 12

const props = defineProps({
  tailData: { type: Array as PropType<TailData[]>, default: () => [] },
  hoveredTicker: { type: String as PropType<string | null>, default: null },
  tailStrokeWidth: { type: Number, default: 1.75 },
})

const emit = defineEmits<{
  tailEnter: [ticker: string]
  tailLeave: [event: PointerEvent]
}>()

const orderedTails = computed(() => {
  const tails = [...props.tailData]
  if (!props.hoveredTicker) return tails
  const idx = tails.findIndex((t) => t.ticker === props.hoveredTicker)
  if (idx < 0) return tails
  const [hovered] = tails.splice(idx, 1)
  tails.push(hovered)
  return tails
})

function segmentOpacity(ticker: string, opacity: number): number {
  if (!props.hoveredTicker || ticker === props.hoveredTicker) return opacity
  return opacity * FADED_TAIL_OPACITY
}

function onTailEnter(ticker: string) {
  emit('tailEnter', ticker)
}

function onTailLeave(event: PointerEvent) {
  const related = event.relatedTarget
  if (related instanceof Element) {
    const host = (event.currentTarget as Element | null)?.closest('.rrg-tail')
    if (host?.contains(related)) return
  }
  emit('tailLeave', event)
}
</script>

<template>
  <g class="rrg-tails" data-testid="rrg-tails">
    <g
      v-for="tail in orderedTails"
      :key="tail.ticker"
      class="rrg-tail"
      :class="{ 'rrg-tail--hovered': tail.ticker === hoveredTicker }"
      :data-testid="`rrg-tail-${tail.ticker}`"
    >
      <line
        v-for="(segment, i) in tail.segments"
        :key="`${tail.ticker}-hit-${i}-${segment.date}`"
        class="rrg-tail-hit"
        data-testid="rrg-tail-hit"
        :x1="segment.x1"
        :y1="segment.y1"
        :x2="segment.x2"
        :y2="segment.y2"
        stroke="transparent"
        :stroke-width="TAIL_HIT_WIDTH"
        stroke-linecap="round"
        pointer-events="stroke"
        @pointerenter="onTailEnter(tail.ticker)"
        @pointerleave="onTailLeave($event)"
      />
      <line
        v-for="(segment, i) in tail.segments"
        :key="`${tail.ticker}-${i}-${segment.date}`"
        class="rrg-tail-segment"
        :x1="segment.x1"
        :y1="segment.y1"
        :x2="segment.x2"
        :y2="segment.y2"
        :stroke="tail.color"
        :stroke-width="tail.ticker === hoveredTicker ? tailStrokeWidth + 0.75 : tailStrokeWidth"
        :stroke-opacity="segmentOpacity(tail.ticker, segment.opacity)"
        stroke-linecap="round"
        pointer-events="none"
      />
    </g>
  </g>
</template>
