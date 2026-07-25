import type { ChartTransform, PlacementResult } from './types'
import { DEFAULT_TRANSFORM } from './types'

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/**
 * Render placement result as a standalone SVG string for visual inspection.
 */
export function renderPlacementSvg(
  result: PlacementResult,
  transform: ChartTransform = DEFAULT_TRANSFORM,
  title?: string,
): string {
  const { width, height, padding, xMin, xMax, yMin, yMax } = transform
  const innerW = width - padding * 2
  const innerH = height - padding * 2

  const xToPx = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * innerW
  const yToPx = (y: number) => padding + (1 - (y - yMin) / (yMax - yMin)) * innerH

  const centerX = xToPx(100)
  const centerY = yToPx(100)

  const points = result.labels
    .map((l) => {
      const point = `<circle cx="${l.px.toFixed(1)}" cy="${l.py.toFixed(1)}" r="3.5" fill="#1f4e79" />`
      if (l.hidden) {
        return `${point}<text x="${(l.px + 6).toFixed(1)}" y="${(l.py + 3).toFixed(1)}" font-size="9" fill="#999" text-decoration="line-through">${escapeXml(l.ticker)}</text>`
      }
      const box = `<rect x="${l.labelX.toFixed(1)}" y="${l.labelY.toFixed(1)}" width="${l.width}" height="${l.height}" fill="#fff8" stroke="#888" stroke-width="0.5" />`
      const text = `<text x="${(l.labelX + 2).toFixed(1)}" y="${(l.labelY + l.height - 2).toFixed(1)}" font-size="10" font-family="ui-monospace, monospace" fill="#111">${escapeXml(l.ticker)}</text>`
      const leader = `<line x1="${l.px.toFixed(1)}" y1="${l.py.toFixed(1)}" x2="${(l.labelX + l.width / 2).toFixed(1)}" y2="${(l.labelY + l.height / 2).toFixed(1)}" stroke="#aaa" stroke-width="0.75" />`
      return `${leader}${point}${box}${text}`
    })
    .join('\n')

  const heading = title ?? result.algorithm
  const stats = `placed ${result.placedCount} / hidden ${result.hiddenCount}`

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#f7f7f5"/>
  <text x="${padding}" y="24" font-size="14" font-family="system-ui,sans-serif" fill="#222">${escapeXml(heading)}</text>
  <text x="${padding}" y="40" font-size="11" font-family="system-ui,sans-serif" fill="#555">${escapeXml(stats)}</text>
  <line x1="${padding}" y1="${centerY}" x2="${width - padding}" y2="${centerY}" stroke="#ccc" stroke-dasharray="4 3"/>
  <line x1="${centerX}" y1="${padding}" x2="${centerX}" y2="${height - padding}" stroke="#ccc" stroke-dasharray="4 3"/>
  <rect x="${padding}" y="${padding}" width="${innerW}" height="${innerH}" fill="none" stroke="#bbb"/>
  ${points}
</svg>
`
}
