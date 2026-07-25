import { computed, type ComputedRef, type Ref } from 'vue'
import type { RrgRenderPoint, RrgRenderSeries } from '../types/rrg'
import type { RrgScale } from './useRrgScales'

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
 * Derives current-frame points and (from C5) pixel-space tail segments.
 */
export function useRrgTailSlices(
  series: MaybeComputed<RrgRenderSeries[]>,
  selectedDate: MaybeComputed<string>,
  tailLength: MaybeComputed<number> = computed(() => 10),
  xScale?: MaybeComputed<RrgScale>,
  yScale?: MaybeComputed<RrgScale>,
): {
  currentPoints: ComputedRef<RrgRenderPoint[]>
  tailData: ComputedRef<TailData[]>
} {
  const currentPoints = computed((): RrgRenderPoint[] => {
    const out: RrgRenderPoint[] = []
    for (const s of series.value) {
      if (s.visible === false) continue
      const point = s.points.find((p) => p.date === selectedDate.value)
      if (!point) continue
      out.push({
        ticker: s.ticker,
        label: s.label,
        name: s.name,
        x: point.x,
        y: point.y,
        quadrant: point.quadrant,
        date: point.date,
        color: s.color,
      })
    }
    return out
  })

  const tailData = computed((): TailData[] => {
    if (!xScale || !yScale) return []

    const out: TailData[] = []
    for (const s of series.value) {
      if (s.visible === false) continue
      const endIdx = s.points.findIndex((p) => p.date === selectedDate.value)
      if (endIdx < 0) continue

      const startIdx = Math.max(0, endIdx - Math.max(1, tailLength.value) + 1)
      const tailPoints = s.points.slice(startIdx, endIdx + 1)
      if (tailPoints.length < 2) {
        out.push({ ticker: s.ticker, color: s.color ?? '#888', segments: [] })
        continue
      }

      const denom = Math.max(tailPoints.length - 2, 1)
      const segments = tailPoints.slice(0, -1).map((point, i) => {
        const next = tailPoints[i + 1]
        const progress = i / denom
        const opacity =
          TAIL_OPACITY_MIN + progress * (TAIL_OPACITY_MAX - TAIL_OPACITY_MIN)
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
        ticker: s.ticker,
        color: s.color ?? '#888',
        segments,
      })
    }
    return out
  })

  return { currentPoints, tailData }
}
