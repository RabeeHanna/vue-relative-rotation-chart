import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
  type MaybeRef,
  type Ref,
} from 'vue'
import {
  RRG_DEFAULT_CHART_HEIGHT,
  RRG_DEFAULT_CHART_WIDTH,
  RRG_DEFAULT_MARGIN,
  RRG_MIN_CHART_HEIGHT,
  type RrgMargin,
} from '../utils/chartLayout'

/**
 * Single source of truth for chart SVG and plot box dimensions.
 * Measures the host when width/height props are omitted.
 */
export function useRrgChartDimensions(
  host: Ref<HTMLElement | null>,
  width: MaybeRef<number | undefined>,
  height: MaybeRef<number | undefined>,
  margin: RrgMargin = RRG_DEFAULT_MARGIN,
) {
  const measuredWidth = ref(RRG_DEFAULT_CHART_WIDTH)
  const measuredHeight = ref(RRG_DEFAULT_CHART_HEIGHT)

  let observer: ResizeObserver | null = null

  onMounted(() => {
    if (!host.value) return
    const update = () => {
      if (!host.value) return
      measuredWidth.value = host.value.clientWidth || RRG_DEFAULT_CHART_WIDTH
      measuredHeight.value = host.value.clientHeight || RRG_DEFAULT_CHART_HEIGHT
    }
    update()
    observer = new ResizeObserver(update)
    observer.observe(host.value)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })

  const svgWidth = computed(() => toValue(width) ?? measuredWidth.value)
  const svgHeight = computed(() =>
    toValue(height) ?? Math.max(RRG_MIN_CHART_HEIGHT, measuredHeight.value),
  )

  const plotWidth = computed(() =>
    Math.max(0, svgWidth.value - margin.left - margin.right),
  )
  const plotHeight = computed(() =>
    Math.max(0, svgHeight.value - margin.top - margin.bottom),
  )

  return { svgWidth, svgHeight, plotWidth, plotHeight }
}
