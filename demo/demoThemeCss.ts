/** Hex palettes for demo color pickers — mirrors `RrgChart.css` light/dark tokens. */
export function themeCssDefaults(theme: 'light' | 'dark') {
  if (theme === 'dark') {
    return { cssBg: '#242424', cssLabel: '#f5f5f5', cssGrid: '#555555' }
  }
  return { cssBg: '#ffffff', cssLabel: '#222222', cssGrid: '#d0d0cc' }
}

export function matchesThemeCssDefaults(
  theme: 'light' | 'dark',
  css: { cssBg: string; cssLabel: string; cssGrid: string },
) {
  const d = themeCssDefaults(theme)
  return css.cssBg === d.cssBg && css.cssLabel === d.cssLabel && css.cssGrid === d.cssGrid
}

/** Inline overrides only when pickers diverge from the active theme (else `.dark` CSS wins). */
export function chartThemeStyle(
  theme: 'light' | 'dark',
  css: { cssBg: string; cssLabel: string; cssGrid: string },
): Record<string, string> | undefined {
  if (matchesThemeCssDefaults(theme, css)) return undefined
  return {
    '--rrg-bg': css.cssBg,
    '--rrg-label': css.cssLabel,
    '--rrg-grid': css.cssGrid,
  }
}

/** Align pickers with theme when they still hold the other theme’s factory defaults. */
export function syncThemeCssPickers(
  theme: 'light' | 'dark',
  css: { cssBg: string; cssLabel: string; cssGrid: string },
) {
  const other = theme === 'dark' ? 'light' : 'dark'
  if (matchesThemeCssDefaults(other, css) || matchesThemeCssDefaults(theme, css)) {
    return themeCssDefaults(theme)
  }
  return css
}
