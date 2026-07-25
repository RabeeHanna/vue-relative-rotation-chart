import { test, expect } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..')
const shotDir = path.join(root, 'plans/screenshots')

async function shot(
  page: import('@playwright/test').Page,
  name: string,
  query: string,
) {
  await page.goto(`/${query}`)
  await expect(page.getByTestId('rrg-chart')).toBeVisible()
  await page.getByTestId('rrg-chart').screenshot({
    path: path.join(shotDir, `${name}.png`),
  })
}

test.describe('adversarial screenshots', () => {
  test('capture review states', async ({ page }) => {
    await shot(page, '01-default-fit-light', '?scenario=default&viewportMode=fit')
    await shot(
      page,
      '02-default-fit-dark',
      '?scenario=default&viewportMode=fit&theme=dark',
    )
    await shot(
      page,
      '03-dense-auto',
      '?scenario=denseCluster&labelMode=auto',
    )
    await shot(
      page,
      '04-dense-always',
      '?scenario=denseCluster&labelMode=always',
    )
    await shot(
      page,
      '05-outlier-fit',
      '?scenario=farRightOutlier&viewportMode=fit',
    )
    await shot(
      page,
      '06-outlier-center',
      '?scenario=farRightOutlier&viewportMode=center',
    )
    await shot(
      page,
      '07-outlier-max',
      '?scenario=farRightOutlier&viewportMode=max',
    )
    await shot(
      page,
      '08-stress-hover',
      '?scenario=stress&labelMode=hover',
    )

    await page.goto('/?scenario=default')
    await page.getByTestId('rrg-point-XLK').hover()
    await expect(page.getByTestId('rrg-tooltip')).toBeVisible()
    await page.getByTestId('rrg-chart').screenshot({
      path: path.join(shotDir, '09-hover-fade.png'),
    })
  })
})
