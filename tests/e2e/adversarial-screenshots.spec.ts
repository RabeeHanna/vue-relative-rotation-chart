import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..')
const shotDir = path.join(root, 'plans/screenshots')

type ArtifactMeta = {
  name: string
  query: string
  selectedDate: string | null
  dateStatus: string | null
  viewportMode: string | null
  theme: string | null
  pointCount: number
  capturedAt: string
}

async function captureArtifact(
  page: import('@playwright/test').Page,
  name: string,
  query: string,
) {
  await page.goto(`/${query}`)
  const chart = page.getByTestId('rrg-chart')
  await expect(chart).toBeVisible()

  const selectedDate = await chart.getAttribute('data-selected-date')
  const dateStatus = await chart.getAttribute('data-date-status')
  const viewportMode = await chart.getAttribute('data-viewport-mode')
  const pointCount = await page.locator('[data-testid^="rrg-point-"]').count()
  const theme = query.includes('theme=light')
    ? 'light'
    : query.includes('theme=dark')
      ? 'dark'
      : 'dark'

  const meta: ArtifactMeta = {
    name,
    query,
    selectedDate,
    dateStatus,
    viewportMode,
    theme,
    pointCount,
    capturedAt: new Date().toISOString(),
  }

  await chart.screenshot({ path: path.join(shotDir, `${name}.png`) })
  fs.writeFileSync(
    path.join(shotDir, `${name}.json`),
    `${JSON.stringify(meta, null, 2)}\n`,
    'utf8',
  )
}

test.describe('review artifacts', () => {
  test('capture screenshots + debug JSON', async ({ page }) => {
    fs.mkdirSync(shotDir, { recursive: true })

    await captureArtifact(page, '01-default-fit-light', '?scenario=default&viewportMode=fit&theme=light')
    await captureArtifact(
      page,
      '02-default-fit-dark',
      '?scenario=default&viewportMode=fit&theme=dark',
    )
    await captureArtifact(
      page,
      '03-dense-auto',
      '?scenario=denseCluster&labelMode=auto&theme=light',
    )
    await captureArtifact(
      page,
      '04-dense-always',
      '?scenario=denseCluster&labelMode=always&theme=light',
    )
    await captureArtifact(
      page,
      '05-outlier-fit',
      '?scenario=farRightOutlier&viewportMode=fit&theme=light',
    )
    await captureArtifact(
      page,
      '06-outlier-center',
      '?scenario=farRightOutlier&viewportMode=center&theme=light',
    )
    await captureArtifact(
      page,
      '07-outlier-max',
      '?scenario=farRightOutlier&viewportMode=max&theme=light',
    )
    await captureArtifact(
      page,
      '08-stress-hover',
      '?scenario=stress&labelMode=hover&theme=light',
    )

    await page.goto('/?scenario=default&theme=light')
    await page.getByTestId('rrg-point-XLK').hover()
    await expect(page.getByTestId('rrg-tooltip')).toBeVisible()
    const chart = page.getByTestId('rrg-chart')
    const meta: ArtifactMeta = {
      name: '09-hover-fade',
      query: '?scenario=default&theme=light (hover XLK)',
      selectedDate: await chart.getAttribute('data-selected-date'),
      dateStatus: await chart.getAttribute('data-date-status'),
      viewportMode: await chart.getAttribute('data-viewport-mode'),
      theme: 'light',
      pointCount: await page.locator('[data-testid^="rrg-point-"]').count(),
      capturedAt: new Date().toISOString(),
    }
    await chart.screenshot({ path: path.join(shotDir, '09-hover-fade.png') })
    fs.writeFileSync(
      path.join(shotDir, '09-hover-fade.json'),
      `${JSON.stringify(meta, null, 2)}\n`,
      'utf8',
    )
  })
})
