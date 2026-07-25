import { describe, expect, it } from 'vitest'
import {
  chartThemeStyle,
  matchesThemeCssDefaults,
  syncThemeCssPickers,
  themeCssDefaults,
} from '../demo/demoThemeCss'

describe('demoThemeCss', () => {
  it('exposes distinct light and dark picker defaults', () => {
    expect(themeCssDefaults('light').cssBg).toBe('#ffffff')
    expect(themeCssDefaults('dark').cssBg).toBe('#1a1a2e')
    expect(themeCssDefaults('dark').cssLabel).not.toBe(themeCssDefaults('light').cssLabel)
  })

  it('omits inline themeStyle when pickers match the active theme', () => {
    expect(chartThemeStyle('dark', themeCssDefaults('dark'))).toBeUndefined()
    expect(chartThemeStyle('light', themeCssDefaults('light'))).toBeUndefined()
  })

  it('applies inline overrides only for customized pickers', () => {
    expect(
      chartThemeStyle('dark', {
        cssBg: '#112233',
        cssLabel: '#eeeeee',
        cssGrid: '#404058',
      }),
    ).toEqual({
      '--rrg-bg': '#112233',
      '--rrg-label': '#eeeeee',
      '--rrg-grid': '#404058',
    })
  })

  it('syncs stale light factory pickers when theme is dark', () => {
    const synced = syncThemeCssPickers('dark', themeCssDefaults('light'))
    expect(matchesThemeCssDefaults('dark', synced)).toBe(true)
  })

  it('preserves true custom picker values across theme sync', () => {
    const custom = { cssBg: '#010203', cssLabel: '#aabbcc', cssGrid: '#112233' }
    expect(syncThemeCssPickers('dark', custom)).toEqual(custom)
  })
})
