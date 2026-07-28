export type ExportChartPngOptions = {
  /** Canvas scale factor (default 2). */
  scale?: number
  /** Background fill before drawing SVG (default transparent). */
  backgroundColor?: string
}

/** Clone and serialize an SVG element for export. */
export function serializeSvgElement(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement
  if (!clone.getAttribute('xmlns')) {
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  }
  return new XMLSerializer().serializeToString(clone)
}

export function svgMarkupToDataUrl(markup: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`
}

function readSvgDimensions(svg: SVGSVGElement): { width: number; height: number } {
  const width = Number(svg.getAttribute('width')) || svg.viewBox?.baseVal?.width || 640
  const height = Number(svg.getAttribute('height')) || svg.viewBox?.baseVal?.height || 480
  return { width, height }
}

/** Rasterize SVG markup to a PNG data URL via canvas (browser only). */
export async function rasterizeSvgToPngDataUrl(
  svgMarkup: string,
  width: number,
  height: number,
  options: ExportChartPngOptions = {},
): Promise<string> {
  const scale = options.scale ?? 2
  const backgroundColor = options.backgroundColor ?? 'transparent'
  const dataUrl = svgMarkupToDataUrl(svgMarkup)

  const image = await loadImage(dataUrl)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width * scale))
  canvas.height = Math.max(1, Math.round(height * scale))
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')

  if (backgroundColor !== 'transparent') {
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/png')
}

export async function exportSvgElementAsPng(
  svg: SVGSVGElement,
  options: ExportChartPngOptions = {},
): Promise<string> {
  const markup = serializeSvgElement(svg)
  const { width, height } = readSvgDimensions(svg)
  return rasterizeSvgToPngDataUrl(markup, width, height, options)
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Failed to load SVG image for export'))
    image.src = src
  })
}
