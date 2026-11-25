import { beforeEach, describe, it, expect } from 'vitest'
import { parse, stringify } from 'flatted'

describe('localstorage', () => {
  beforeEach(() => {
    const pinia = useNuxtApp().$pinia
    usePeople().$dispose()
    delete pinia.state.value.people
    localStorage.clear()
  })

  const checkLocal = (name: string) => {
    return parse(localStorage.getItem(name)!)
  }

  it('should have localStorage', async () => {
    const p = usePeople()
    expect(p.count).toBe(2)
    expect(checkLocal('people')).toHaveProperty('source.count', p.count)
    p.count++
    await nextTick()
    expect(checkLocal('people')).toHaveProperty('undoStack[0].snapshot', '[{"count":2}]')
  })
  it('should recover from localStorage', async () => {
    localStorage.setItem('people', stringify({
      source: { count: 3 },
      undoStack: [{ snapshot: stringify({ count: 2 }), timestamp: 1708422189454 }],
      redoStack: [],
    }))
    const p = usePeople()
    expect(p.count).toBe(3)
    expect(p.canUndo).toBe(true)
    p.undo()
    await nextTick()
    expect(p.count).toBe(2)
    expect(checkLocal('people')).toHaveProperty('source.count', 2)
  })
})
