import { computed, type ComputedRef, type Ref } from 'vue'
import type { RrgRenderPoint } from '../types/rrg'
import type { RrgScale } from './useRrgScales'
import { getPointAtDate, type SeriesIndex } from '../utils/seriesIndex'

export type TailSegment = {
  x1: number
  y1: number
  x2: number
  y2: number
  opacity: number
  date: string
}

export type TailData = {
  ticker: string
  color: string
  segments: TailSegment[]
}

export const TAIL_OPACITY_MIN = 0.1
export const TAIL_OPACITY_MAX = 0.85

type MaybeComputed<T> = ComputedRef<T> | Ref<T>

/**
 * Derives current-frame points and pixel-space tail segments from a series index.
 */
export function useRrgTailSlices(
  seriesIndex: MaybeComputed<SeriesIndex>,
  selectedDate: MaybeComputed<string>,
  tailLength: MaybeComputed<number> = computed(() => 10),
  xScale?: MaybeComputed<RrgScale>,
  yScale?: MaybeComputed<RrgScale>,
  showTailFade: MaybeComputed<boolean> = computed(() => false),
): {
  currentPoints: ComputedRef<RrgRenderPoint[]>
  tailData: ComputedRef<TailData[]>
} {
  const currentPoints = computed((): RrgRenderPoint[] => {
    const out: RrgRenderPoint[] = []
    const date = selectedDate.value
    for (const entry of seriesIndex.value.entries) {
      if (!entry.visible) continue
      const point = getPointAtDate(entry, date)
      if (!point) continue
      out.push({
        ticker: entry.ticker,
        label: entry.label,
        name: entry.name,
        x: point.x,
        y: point.y,
        quadrant: point.quadrant,
        date: point.date,
        color: entry.color,
      })
    }
    return out
  })

  const tailData = computed((): TailData[] => {
    if (!xScale || !yScale) return []

    const fade = showTailFade.value
    const date = selectedDate.value
    const out: TailData[] = []
    for (const entry of seriesIndex.value.entries) {
      if (!entry.visible) continue
      const endIdx = entry.dateToIndex.get(date)
      if (endIdx === undefined) continue

      const startIdx = Math.max(0, endIdx - Math.max(1, tailLength.value) + 1)
      const tailPoints = entry.points.slice(startIdx, endIdx + 1)
      if (tailPoints.length < 2) {
        out.push({ ticker: entry.ticker, color: entry.color ?? '#888', segments: [] })
        continue
      }

      const denom = Math.max(tailPoints.length - 2, 1)
      const segments = tailPoints.slice(0, -1).map((point, i) => {
        const next = tailPoints[i + 1]!
        const progress = i / denom
        const opacity = fade
          ? TAIL_OPACITY_MIN + progress * (TAIL_OPACITY_MAX - TAIL_OPACITY_MIN)
          : TAIL_OPACITY_MAX
        return {
          x1: xScale.value(point.x),
          y1: yScale.value(point.y),
          x2: xScale.value(next.x),
          y2: yScale.value(next.y),
          opacity,
          date: next.date,
        }
      })

      out.push({
        ticker: entry.ticker,
        color: entry.color ?? '#888',
        segments,
      })
    }
    return out
  })

  return { currentPoints, tailData }
}
