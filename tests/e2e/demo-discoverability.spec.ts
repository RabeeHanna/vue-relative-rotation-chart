import { expect, test } from '@playwright/test'

test.describe('demo discoverability shell', () => {
  test('single static h1 and no duplicate Vue intro', async ({ page }) => {
    await page.goto('/')
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    await expect(h1).toHaveText('Interactive Vue 3 Relative Rotation Graph component')
    await expect(page.getByTestId('demo-app')).toBeVisible()
    await expect(page.getByText('Renderer only — data and calculations')).toHaveCount(0)
  })

  test('static npm and GitHub links are visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'npm' })).toHaveAttribute(
      'href',
      'https://www.npmjs.com/package/vue-relative-rotation-chart',
    )
    await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/RabeeHanna/vue-relative-rotation-chart',
    )
  })
})
