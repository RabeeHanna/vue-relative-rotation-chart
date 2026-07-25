<script setup lang="ts">
import { computed, provide, ref, onMounted, onBeforeUnmount } from 'vue'
import {
  RRG_CHART_INJECTION,
  RRG_DEFAULT_MARGIN,
  type RrgMargin,
} from '../utils/chartLayout'

const props = withDefaults(
  defineProps<{
    width?: number
    height?: number
    margin?: RrgMargin
  }>(),
  {
    width: undefined,
    height: undefined,
    margin: () => ({ ...RRG_DEFAULT_MARGIN }),
  },
)

const host = ref<HTMLElement | null>(null)
const measuredWidth = ref(640)
const measuredHeight = ref(480)

let observer: ResizeObserver | null = null

onMounted(() => {
  if (!host.value) return
  const update = () => {
    if (!host.value) return
    measuredWidth.value = host.value.clientWidth || 640
    measuredHeight.value = host.value.clientHeight || 480
  }
  update()
  observer = new ResizeObserver(update)
  observer.observe(host.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

const svgWidth = computed(() => props.width ?? measuredWidth.value)
const svgHeight = computed(() => props.height ?? Math.max(320, measuredHeight.value))

const plotWidth = computed(() =>
  Math.max(0, svgWidth.value - props.margin.left - props.margin.right),
)
const plotHeight = computed(() =>
  Math.max(0, svgHeight.value - props.margin.top - props.margin.bottom),
)

provide(RRG_CHART_INJECTION.plotWidth, plotWidth)
provide(RRG_CHART_INJECTION.plotHeight, plotHeight)
provide(RRG_CHART_INJECTION.margin, computed(() => props.margin))

defineExpose({ plotWidth, plotHeight, svgWidth, svgHeight })
</script>

<template>
  <div ref="host" class="rrg-svg-host" data-testid="rrg-svg-host">
    <svg
      class="rrg-svg-root"
      data-testid="rrg-svg-root"
      :width="svgWidth"
      :height="svgHeight"
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
      role="img"
    >
      <rect
        class="rrg-bg"
        x="0"
        y="0"
        :width="svgWidth"
        :height="svgHeight"
        fill="var(--rrg-bg, #ffffff)"
      />
      <g
        class="rrg-plot"
        data-testid="rrg-plot"
        :transform="`translate(${margin.left}, ${margin.top})`"
      >
        <slot />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.rrg-svg-host {
  width: 100%;
  min-height: 320px;
  display: block;
}

.rrg-svg-root {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}
</style>
