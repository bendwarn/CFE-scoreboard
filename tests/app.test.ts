import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, inject, onBeforeUnmount, onMounted } from 'vue'
import App from '../app/app.vue'
import { historyDragKey } from '../app/utils/history-drag'

const listeners = new Map<string, (event: any) => void>()
const DashboardStub = defineComponent({
  setup() {
    const registerHistoryDrag = inject(historyDragKey)!
    onMounted(() => {
      const target = {
        on(type: string, listener: (event: any) => void) {
          listeners.set(type, listener)
          return target
        },
      }
      registerHistoryDrag(target as Parameters<typeof registerHistoryDrag>[0])
    })
    onBeforeUnmount(() => listeners.clear())
  },
  template: '<div />',
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
          NuxtPwaManifest: true,
          Calculator: { template: '<dialog />' },
          Dashboard: DashboardStub,
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
