// @vitest-environment nuxt
import { beforeEach, describe, expect, it } from 'vitest'
import { parse } from 'flatted'
import { defineStore } from 'pinia'

describe('pinia history plugin', () => {
  beforeEach(() => {
    localStorage.clear()
    const people = usePeople()
    people.reset()
    people.count = 2
  })

  it('should enable undo and redo after state changes', async () => {
    const people = usePeople()
    expect(people.canUndo).toBe(false)
    expect(people.canRedo).toBe(false)

    people.count++
    await nextTick()
    expect(people.canUndo).toBe(true)

    people.undo()
    await nextTick()
    expect(people.count).toBe(2)
    expect(people.canRedo).toBe(true)

    people.redo()
    await nextTick()
    expect(people.count).toBe(3)
  })

  it('should clear history after reset', async () => {
    const people = usePeople()
    people.count++
    await nextTick()
    expect(people.canUndo).toBe(true)

    people.reset()
    await nextTick()
    expect(people.count).toBe(2)
    expect(people.canUndo).toBe(false)
    expect(people.canRedo).toBe(false)
  })

  it('should persist history payload to localStorage', async () => {
    const people = usePeople()
    people.count++
    await nextTick()

    const payload = parse(localStorage.getItem('people')!)
    expect(payload).toHaveProperty('source.count', 3)
    expect(payload).toHaveProperty('undoStack.0.snapshot')
  })

  it('should recover safely from corrupted localStorage payload', () => {
    localStorage.setItem('corrupted-store', 'not a valid flatted payload')

    const useCorruptedStore = defineStore('corrupted-store', {
      state: () => ({ count: 10 }),
      actions: {
        parse(lsValue: any) {
          this.count = lsValue.count
        },
      },
    })

    expect(() => useCorruptedStore()).not.toThrow()
    expect(useCorruptedStore().count).toBe(10)
  })
})
