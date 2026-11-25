import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createPage, setup } from '@nuxt/test-utils/e2e'
import type { Page } from 'playwright-core'

describe('calculator e2e', async () => {
  await setup({
    host: 'http://localhost:3000',
    build: false,
    server: false,
  })

  let page: Page
  beforeEach(async () => {
    page = await createPage('/CFE-scoreboard/')
  })
  afterEach(async () => {
    await page?.close()
  })

  it('should compute hp with wasm in real browser flow', async () => {
    await page.locator('.hp').first().click()
    const dialog = page.locator('dialog[open]')
    await dialog.waitFor({ state: 'visible' })

    await dialog.getByText('-', { exact: true }).click()
    await dialog.getByText('2', { exact: true }).click()
    await dialog.getByText('=', { exact: true }).click()

    await dialog.waitFor({ state: 'hidden' })
    await page.getByText('248', { exact: true }).first().waitFor()
  })

  it.each([
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ])('keeps the calculator inside a $width × $height viewport', async (viewport) => {
    await page.setViewportSize(viewport)
    await page.locator('.hp').first().click()
    const dialog = page.locator('dialog[open]')
    await dialog.waitFor({ state: 'visible' })
    const box = (await dialog.boundingBox())!
    expect(box.x).toBeGreaterThanOrEqual(0)
    expect(box.y).toBeGreaterThanOrEqual(0)
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height)
    await expect.poll(() => page.getByLabel('等於').isVisible()).toBe(true)
  })
})
