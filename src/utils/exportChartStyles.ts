/** Theme custom properties copied from `.rrg-chart` onto exported SVG roots. */
export const RRG_THEME_VARIABLE_NAMES = [
  '--rrg-bg',
  '--rrg-grid',
  '--rrg-axis',
  '--rrg-center-line',
  '--rrg-axis-label',
  '--rrg-quadrant-label',
  '--rrg-label',
  '--rrg-muted-label',
  '--rrg-point-stroke',
  '--rrg-tooltip-bg',
  '--rrg-font-family',
] as const

/** Copy resolved `--rrg-*` values from the chart host onto the cloned SVG root. */
export function applyThemeVariablesToClone(
  clone: SVGSVGElement,
  styleHost: HTMLElement,
): void {
  const computed = getComputedStyle(styleHost)
  for (const name of RRG_THEME_VARIABLE_NAMES) {
    const value =
      computed.getPropertyValue(name).trim() || styleHost.style.getPropertyValue(name).trim()
    if (value) {
      clone.style.setProperty(name, value)
    }
  }
}

/** Prepare an SVG clone for isolated rasterization (img/canvas) export. */
export function prepareSvgCloneForExport(
  clone: SVGSVGElement,
  styleHost: HTMLElement,
): void {
  applyThemeVariablesToClone(clone, styleHost)
}
