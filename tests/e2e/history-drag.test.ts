import { describe, expect, it } from 'vitest'
import { createPage, setup } from '@nuxt/test-utils/e2e'

describe('history drag', async () => {
  await setup({ host: 'http://localhost:3000', build: false, server: false })

  it('keeps undo and redo outside the screen, even over another HP dropzone', async () => {
    const page = await createPage('/CFE-scoreboard/')
    await page.setViewportSize({ width: 1000, height: 800 })
    const hp = page.locator('.hp').last()
    const otherHp = page.locator('.hp').first()
    await otherHp.click()
    let dialog = page.locator('dialog[open]')
    await dialog.getByText('-', { exact: true }).click()
    await dialog.getByText('5', { exact: true }).click()
    await dialog.getByText('=', { exact: true }).click()
    await expect.poll(async () => otherHp.textContent()).toContain('245')

    await hp.click()
    dialog = page.locator('dialog[open]')
    await dialog.getByText('-', { exact: true }).click()
    await dialog.getByText('2', { exact: true }).click()
    await dialog.getByText('=', { exact: true }).click()
    await expect.poll(async () => hp.textContent()).toContain('248')

    const box = (await hp.boundingBox())!
    const y = box.y + box.height / 2
    const startX = box.x + box.width / 2
    await page.mouse.move(startX, y)
    await page.mouse.down()
    await page.mouse.move(5, y, { steps: 20 })
    await page.waitForTimeout(400)
    await page.mouse.move(-20, y)
    await page.mouse.up()
    await page.waitForTimeout(700)
    await expect.poll(async () => hp.textContent()).toContain('250')
    expect(await otherHp.textContent()).toContain('245')

    await page.mouse.move(startX, y)
    await page.mouse.down()
    await page.mouse.move(995, y, { steps: 20 })
    await page.waitForTimeout(400)
    await page.mouse.move(1020, y)
    await page.mouse.up()
    await page.waitForTimeout(700)
    await expect.poll(async () => hp.textContent()).toContain('248')
    expect(await otherHp.textContent()).toContain('245')

    // Release over the other HP dropzone, inside the history area.
    await page.mouse.move(startX, y)
    await page.mouse.down()
    await page.mouse.move(5, y, { steps: 20 })
    await page.mouse.up()
    await page.waitForTimeout(700)
    await expect.poll(async () => hp.textContent()).toContain('250')
    expect(await otherHp.textContent()).toContain('245')
  })
})
