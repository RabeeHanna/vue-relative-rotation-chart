/** Expected tail SVG node counts for a full window at the selected frame. */

export function segmentsPerTicker(tailLength: number, pointsThroughSelected: number): number {
  const L = Math.min(Math.max(1, Math.floor(tailLength)), Math.max(0, pointsThroughSelected))
  return Math.max(0, L - 1)
}

/**
 * Default mode: one visual polyline + one hit polyline per active ticker.
 * Fade mode: per-segment visual lines + one hit polyline per active ticker.
 */
export function expectedTailNodeCounts(input: {
  tickerCount: number
  tailLength: number
  /** Points available through selectedDate (inclusive), usually frameIndex+1 or P at end. */
  pointsThroughSelected: number
  showTailFade?: boolean
  /** Tickers that render a tail at the selected frame (defaults to tickerCount). */
  activeTickerCount?: number
}): { visualNodes: number; hitNodes: number; totalNodes: number } {
  const segmentCount = segmentsPerTicker(input.tailLength, input.pointsThroughSelected)
  if (segmentCount === 0) {
    return { visualNodes: 0, hitNodes: 0, totalNodes: 0 }
  }

  const activeTails = input.activeTickerCount ?? input.tickerCount
  const hitNodes = activeTails

  if (!input.showTailFade) {
    return {
      visualNodes: activeTails,
      hitNodes,
      totalNodes: activeTails + hitNodes,
    }
  }

  const visualNodes = activeTails * segmentCount
  return { visualNodes, hitNodes, totalNodes: visualNodes + hitNodes }
}

export const PERF_TARGET_FPS = 55
