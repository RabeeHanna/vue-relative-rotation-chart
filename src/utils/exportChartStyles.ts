/** Theme variables resolved from `.rrg-chart` for self-contained SVG export. */
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

export const RRG_THEME_LIGHT: Record<(typeof RRG_THEME_VARIABLE_NAMES)[number], string> = {
  '--rrg-bg': '#ffffff',
  '--rrg-grid': 'rgba(0, 0, 0, 0.08)',
  '--rrg-axis': 'rgba(0, 0, 0, 0.3)',
  '--rrg-center-line': 'rgba(0, 0, 0, 0.25)',
  '--rrg-axis-label': 'rgba(0, 0, 0, 0.5)',
  '--rrg-quadrant-label': 'rgba(0, 0, 0, 0.15)',
  '--rrg-label': '#222',
  '--rrg-muted-label': '#888',
  '--rrg-point-stroke': '#fff',
  '--rrg-tooltip-bg': 'rgba(255, 255, 255, 0.95)',
  '--rrg-font-family': 'ui-sans-serif, system-ui, sans-serif',
}

export const RRG_THEME_DARK: Record<(typeof RRG_THEME_VARIABLE_NAMES)[number], string> = {
  '--rrg-bg': '#242424',
  '--rrg-grid': 'rgba(255, 255, 255, 0.18)',
  '--rrg-axis': 'rgba(255, 255, 255, 0.45)',
  '--rrg-center-line': 'rgba(255, 255, 255, 0.4)',
  '--rrg-axis-label': 'rgba(255, 255, 255, 0.72)',
  '--rrg-quadrant-label': 'rgba(255, 255, 255, 0.22)',
  '--rrg-label': '#f5f5f5',
  '--rrg-muted-label': '#c8c8c8',
  '--rrg-point-stroke': '#242424',
  '--rrg-tooltip-bg': 'rgba(36, 36, 36, 0.95)',
  '--rrg-font-family': 'ui-sans-serif, system-ui, sans-serif',
}

/** Embedded stylesheet mirroring chart SVG presentation rules (no document CSS). */
export const RRG_CHART_EXPORT_CSS = `
.rrg-grid-line {
  stroke: var(--rrg-grid);
  stroke-width: 1;
  shape-rendering: crispEdges;
}
.rrg-center-line {
  stroke: var(--rrg-center-line);
  stroke-width: 1.25;
  shape-rendering: crispEdges;
}
.rrg-axis-line,
.rrg-tick {
  stroke: var(--rrg-axis);
  stroke-width: 1;
  shape-rendering: crispEdges;
}
.rrg-tick-label,
.rrg-axis-title {
  fill: var(--rrg-axis-label);
  font-size: 11px;
  font-family: var(--rrg-font-family);
}
.rrg-quadrant-label {
  fill: var(--rrg-quadrant-label);
  font-size: 12px;
  font-family: var(--rrg-font-family);
  font-weight: 500;
  letter-spacing: 0.02em;
}
.rrg-label-text {
  fill: var(--rrg-label);
}
`.trim()

const PRESENTATION_ATTRIBUTES = ['fill', 'stroke', 'color', 'stop-color'] as const

function isDarkChartHost(host: HTMLElement): boolean {
  if (host.classList.contains('dark')) return true
  return !!host.closest('.dark')
}

export function collectRrgThemeVariables(host: HTMLElement): Record<string, string> {
  const computed = getComputedStyle(host)
  const defaults = isDarkChartHost(host) ? RRG_THEME_DARK : RRG_THEME_LIGHT
  const vars: Record<string, string> = {}
  for (const name of RRG_THEME_VARIABLE_NAMES) {
    const computedValue = computed.getPropertyValue(name).trim()
    const inlineValue = host.style.getPropertyValue(name).trim()
    vars[name] = computedValue || inlineValue || defaults[name]
  }
  return vars
}

export function resolveCssVarInValue(value: string, vars: Record<string, string>): string {
  return value.replace(
    /var\(\s*(--rrg-[^),]+)(?:\s*,\s*([^)]+))?\s*\)/g,
    (_match, name: string, fallback?: string) => vars[name] ?? fallback?.trim() ?? name,
  )
}

function applyResolvedVariables(clone: SVGSVGElement, vars: Record<string, string>): void {
  const varStyle = Object.entries(vars)
    .map(([name, value]) => `${name}:${value}`)
    .join(';')
  if (varStyle) clone.setAttribute('style', varStyle)
}

function injectExportStylesheet(clone: SVGSVGElement): void {
  const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style')
  styleEl.setAttribute('type', 'text/css')
  styleEl.textContent = RRG_CHART_EXPORT_CSS
  clone.insertBefore(styleEl, clone.firstChild)
}

function inlineVarAttributes(clone: SVGSVGElement, vars: Record<string, string>): void {
  const elements = [clone, ...Array.from(clone.querySelectorAll('*'))]
  for (const el of elements) {
    for (const attr of PRESENTATION_ATTRIBUTES) {
      const value = el.getAttribute(attr)
      if (value?.includes('var(')) {
        el.setAttribute(attr, resolveCssVarInValue(value, vars))
      }
    }
  }
}

/** Apply resolved theme + embedded rules so export survives outside the page stylesheet. */
export function prepareSvgCloneForExport(
  clone: SVGSVGElement,
  styleHost: HTMLElement,
): void {
  const vars = collectRrgThemeVariables(styleHost)
  applyResolvedVariables(clone, vars)
  injectExportStylesheet(clone)
  inlineVarAttributes(clone, vars)
}
