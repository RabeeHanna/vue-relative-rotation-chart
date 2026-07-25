/** Expected visible tail geometry for a full window at the selected frame. */

export function segmentsPerTicker(tailLength: number, pointsThroughSelected: number): number {
  const L = Math.min(Math.max(1, Math.floor(tailLength)), Math.max(0, pointsThroughSelected))
  return Math.max(0, L - 1)
}

/** Hit lines === visible segment lines (C15 twin strokes). */
export function expectedTailLineCounts(input: {
  tickerCount: number
  tailLength: number
  /** Points available through selectedDate (inclusive), usually frameIndex+1 or P at end. */
  pointsThroughSelected: number
}): { segments: number; hits: number; totalLines: number } {
  const per = segmentsPerTicker(input.tailLength, input.pointsThroughSelected)
  const segments = input.tickerCount * per
  const hits = segments
  return { segments, hits, totalLines: segments + hits }
}

export const PERF_TARGET_FPS = 55
