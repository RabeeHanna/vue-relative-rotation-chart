<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { TailData, TailSegment } from '../composables/useRrgTailSlices'
import { tailPolylinePoints } from '../utils/tailPolyline'

const FADED_TAIL_OPACITY = 0.2
/** Invisible hit stroke width (px) — pointer convenience only. */
const TAIL_HIT_WIDTH = 12

const props = defineProps({
  tailData: { type: Array as PropType<TailData[]>, default: () => [] },
  hoveredTicker: { type: String as PropType<string | null>, default: null },
  tailStrokeWidth: { type: Number, default: 1.75 },
  showTailFade: { type: Boolean, default: false },
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

const renderedTails = computed(() =>
  orderedTails.value.map((tail) => ({
    ...tail,
    points: tail.segments.length > 0 ? tailPolylinePoints(tail.segments) : '',
  })),
)

function segmentOpacity(ticker: string, opacity: number): number {
  if (!props.hoveredTicker || ticker === props.hoveredTicker) return opacity
  return opacity * FADED_TAIL_OPACITY
}

function visualOpacity(tail: TailData, segment?: TailSegment): number {
  const base = props.showTailFade
    ? (segment?.opacity ?? 1)
    : (tail.strokeOpacity ?? 1)
  return segmentOpacity(tail.ticker, base)
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
      v-for="tail in renderedTails"
      :key="tail.ticker"
      class="rrg-tail"
      :class="{ 'rrg-tail--hovered': tail.ticker === hoveredTicker }"
      :data-testid="`rrg-tail-${tail.ticker}`"
    >
      <template v-if="tail.segments.length > 0">
        <polyline
          :key="`${tail.ticker}-hit`"
          class="rrg-tail-hit"
          data-testid="rrg-tail-hit"
          :points="tail.points"
          fill="none"
          stroke="transparent"
          :stroke-width="TAIL_HIT_WIDTH"
          stroke-linecap="round"
          stroke-linejoin="round"
          pointer-events="stroke"
          @pointerenter="onTailEnter(tail.ticker)"
          @pointerleave="onTailLeave($event)"
        />
        <template v-if="showTailFade">
          <line
            v-for="(segment, i) in tail.segments"
            :key="`${tail.ticker}-seg-${i}`"
            class="rrg-tail-segment"
            :data-segment-index="i"
            :x1="segment.x1"
            :y1="segment.y1"
            :x2="segment.x2"
            :y2="segment.y2"
            :stroke="tail.color"
            :stroke-width="tail.ticker === hoveredTicker ? tailStrokeWidth + 0.75 : tailStrokeWidth"
            :stroke-opacity="visualOpacity(tail, segment)"
            stroke-linecap="round"
            pointer-events="none"
          />
        </template>
        <polyline
          v-else
          :key="`${tail.ticker}-seg`"
          class="rrg-tail-segment"
          :points="tail.points"
          fill="none"
          :stroke="tail.color"
          :stroke-width="tail.ticker === hoveredTicker ? tailStrokeWidth + 0.75 : tailStrokeWidth"
          :stroke-opacity="visualOpacity(tail)"
          stroke-linecap="round"
          stroke-linejoin="round"
          pointer-events="none"
        />
      </template>
    </g>
  </g>
</template>
