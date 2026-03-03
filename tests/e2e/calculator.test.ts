import { describe, it } from 'vitest'
import { createPage, setup, url } from '@nuxt/test-utils/e2e'

describe('calculator e2e', async () => {
  await setup({
    host: 'http://localhost:3000',
    // browser: true,
    // browserOptions: {
    //   type: 'chromium',
    //   launch: {
    //     headless: true,
    //     args: ['--no-sandbox'],
    //   },
    // },
  })

  it('should compute hp with wasm in real browser flow', async () => {
    const page = await createPage('/CFE-scoreboard/')

    await page.locator('.hp').first().click()
    const dialog = page.locator('dialog[open]')
    await dialog.waitFor({ state: 'visible', timeout: 15_000 })

    await dialog.getByText('-', { exact: true }).click()
    await dialog.getByText('2', { exact: true }).click()
    await dialog.getByText('=', { exact: true }).click()

    await dialog.waitFor({ state: 'hidden', timeout: 15_000 })
    await page.getByText('248', { exact: true }).first().waitFor({ timeout: 15_000 })
  }, 60_000)
})
