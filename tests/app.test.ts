// @vitest-environment nuxt
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../app/app.vue'

const listeners = vi.hoisted(() => new Map<string, (event: any) => void>())

vi.mock('interactjs', () => {
  const interact = Object.assign(vi.fn(), {
    on: (type: string, listener: (event: any) => void) => listeners.set(type, listener),
    off: (type: string) => listeners.delete(type),
  })
  return { default: interact }
})

describe('app undo/redo drag flow', () => {
  beforeEach(() => {
    listeners.clear()
    localStorage.clear()
    usePeople().reset()
    useHealth().reset()
  })

  it('gates history by availability and restores a preview when returning to the center', async () => {
    const hp = useHealth()
    const undoSpy = vi.spyOn(hp, 'undo')
    const redoSpy = vi.spyOn(hp, 'redo')
    const wrapper = await mountSuspended(App, {
      global: {
        stubs: {
          Title: true,
          VitePwaManifest: true,
          Calculator: { template: '<dialog />' },
          Dashboard: { template: '<div />' },
          TheField: { template: '<div />' },
          Gear: { template: '<div />' },
        },
      },
    })

    const event = {
      interaction: {},
      target: { classList: { contains: (klass: string) => klass === 'hp' } },
      clientX: 0,
    }
    listeners.get('dragstart')!(event)
    listeners.get('dragmove')!(event)
    expect(undoSpy).not.toHaveBeenCalled()
    listeners.get('dragend')!(event)

    hp.enemy--
    await nextTick()
    listeners.get('dragstart')!(event)
    listeners.get('dragmove')!(event)
    expect(undoSpy).toHaveBeenCalledTimes(1)
    listeners.get('dragmove')!({ ...event, clientX: -20 })
    expect(undoSpy).toHaveBeenCalledTimes(1)
    listeners.get('dragmove')!({ ...event, clientX: window.innerWidth / 2 })
    expect(redoSpy).toHaveBeenCalledTimes(1)
    listeners.get('dragend')!(event)
    wrapper.unmount()
    expect(listeners.size).toBe(0)
  })
})
