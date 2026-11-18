import { beforeEach, describe, expect, it } from 'vitest'
import { createPage, setup } from '@nuxt/test-utils/e2e'
import type { Page } from 'playwright-core'

describe('history drag', async () => {
  await setup({ host: 'http://localhost:3000', build: false, server: false })

  let page: Page
  beforeEach(async () => {
    page = await createPage('/CFE-scoreboard/')
    await page.setViewportSize({ width: 1000, height: 800 })
  })

  it('keeps undo and redo outside the screen, even over another HP dropzone', async () => {
    const hp = page.locator('.hp').last()
    const otherHp = page.locator('.hp').first()
    const health = () => page.evaluate(() => {
      const state = window.useNuxtApp!().$pinia.state.value.health
      return { enemy: state.enemy, friend: state.friend }
    })
    await otherHp.click()
    let dialog = page.locator('dialog[open]')
    await dialog.getByText('-', { exact: true }).click()
    await dialog.getByText('5', { exact: true }).click()
    await dialog.getByText('=', { exact: true }).click()
    await expect.poll(health).toEqual({ enemy: 245, friend: 250 })

    await hp.click()
    dialog = page.locator('dialog[open]')
    await dialog.getByText('-', { exact: true }).click()
    await dialog.getByText('2', { exact: true }).click()
    await dialog.getByText('=', { exact: true }).click()
    await expect.poll(health).toEqual({ enemy: 245, friend: 248 })

    const box = (await hp.boundingBox())!
    const y = box.y + box.height / 2
    const startX = box.x + box.width / 2
    await page.mouse.move(startX, y)
    await page.mouse.down()
    await page.mouse.move(5, y, { steps: 20 })
    await page.mouse.move(-20, y)
    await page.mouse.up()
    await expect.poll(health).toEqual({ enemy: 245, friend: 250 })

    await page.mouse.move(startX, y)
    await page.mouse.down()
    await page.mouse.move(995, y, { steps: 20 })
    await page.mouse.move(1020, y)
    await page.mouse.up()
    await expect.poll(health).toEqual({ enemy: 245, friend: 248 })

    // Release over the other HP dropzone, inside the history area.
    await page.mouse.move(startX, y)
    await page.mouse.down()
    await page.mouse.move(5, y, { steps: 20 })
    await page.mouse.up()
    await expect.poll(health).toEqual({ enemy: 245, friend: 250 })
  })
})
