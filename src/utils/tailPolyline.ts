/** Pixel-space tail segment used to build consolidated polylines. */
export type TailPolylineSegment = {
  x1: number
  y1: number
  x2: number
  y2: number
}

/** SVG `points` attribute for a connected tail path from consecutive segments. */
export function tailPolylinePoints(segments: TailPolylineSegment[]): string {
  if (segments.length === 0) return ''
  const parts = [`${segments[0]!.x1},${segments[0]!.y1}`]
  for (const segment of segments) {
    parts.push(`${segment.x2},${segment.y2}`)
  }
  return parts.join(' ')
}
