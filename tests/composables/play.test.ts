// @vitest-environment jsdom
import { describe, test, expect } from 'vitest'
import { syncRef } from '@vueuse/core'
import { useClamp } from '@vueuse/math'

describe('My test', async () => {
  test('my test', () => {
    const count = useClamp(2, 1, 10)
    const big = useClamp(20, 15, 30)
    syncRef(count, big)
    expect(count.value).toBe(10)
  })
})
