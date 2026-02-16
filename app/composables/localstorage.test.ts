// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { parse } from 'flatted'

describe('localstorage', async () => {
  const checkLocal = (name: string) => {
    return parse(localStorage.getItem(name)!)
  }

  it('should have localStorage', async () => {
    const p = usePeople()
    expect(checkLocal('people')).toHaveProperty('source.count', p.count)
    p.count++
    await nextTick()
    expect(checkLocal('people')).toHaveProperty('undoStack[0].snapshot', '[{"count":2}]')
    // console.log(localStorage.getItem('people'))
  })
  it('should recover from localStorage', async () => {
    localStorage.setItem(
      'people',
      '[{"source":"1","undoStack":"2","redoStack":"3"},{"count":3},["4"],[],{"snapshot":"5","timestamp":1708422189454},"[{"count":2}]"]',
    )
    const p = usePeople()
    expect(p.count).toBe(3)
    p.undo()
    await nextTick()
    expect(checkLocal('people')).toHaveProperty('source.count', 2)
    // console.log(localStorage.getItem('people'))
  })
})
