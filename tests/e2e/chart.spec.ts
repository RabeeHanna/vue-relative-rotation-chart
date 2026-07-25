import { test, expect } from '@playwright/test'

test('chart renders with correct test IDs', async ({ page }) => {
  await page.goto('/')

  const chart = page.getByTestId('rrg-chart')
  await expect(chart).toBeVisible()

  await expect(page.getByTestId('rrg-point-XLK')).toBeVisible()
  await expect(page.getByTestId('rrg-point-XLF')).toBeVisible()

  await expect(page.getByTestId('rrg-label-XLK')).toBeAttached()
})

test('hover reveals tooltip with ticker info', async ({ page }) => {
  await page.goto('/')

  const point = page.getByTestId('rrg-point-XLK')
  await point.hover()

  const tooltip = page.getByTestId('rrg-tooltip')
  await expect(tooltip).toBeVisible()
  await expect(tooltip).toContainText('XLK')
  await expect(tooltip).toContainText('RS-Ratio')
})

test('point data attributes are correct', async ({ page }) => {
  await page.goto('/')

  const point = page.getByTestId('rrg-point-XLK')
  const quadrant = await point.getAttribute('data-quadrant')
  expect(['leading', 'weakening', 'lagging', 'improving']).toContain(quadrant)

  const x = parseFloat((await point.getAttribute('data-x')) ?? '0')
  expect(x).toBeGreaterThan(0)
})

test('labels accessible in labelMode=always', async ({ page }) => {
  await page.goto('/?labelMode=always')

  await expect(page.getByTestId('rrg-label-XLK')).toBeVisible()
  await expect(page.getByTestId('rrg-label-XLF')).toBeVisible()
})
