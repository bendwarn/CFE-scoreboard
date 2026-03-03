// @vitest-environment nuxt
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../app/app.vue'

type InteractApi = {
  target: unknown
  dropzoneConfig?: Record<string, any>
  draggable: () => InteractApi
  dropzone: (config: Record<string, any>) => InteractApi
  on: () => InteractApi
  unset: () => InteractApi
}

const interactApis: InteractApi[] = []

vi.mock('interactjs', () => ({
  default: vi.fn((target: unknown) => {
    const api: InteractApi = {
      target,
      draggable: () => api,
      dropzone: (config) => {
        api.dropzoneConfig = config
        return api
      },
      on: () => api,
      unset: () => api,
    }
    interactApis.push(api)
    return api
  }),
}))

describe('app undo/redo drag flow', () => {
  beforeEach(() => {
    interactApis.length = 0
    localStorage.clear()
    usePeople().reset()
    useHealth().reset()
  })

  it('should gate undo/redo by canUndo and canRedo refs', async () => {
    const hp = useHealth()
    const undoSpy = vi.spyOn(hp, 'undo')
    const redoSpy = vi.spyOn(hp, 'redo')

    await mountSuspended(App, {
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

    const undoRedoInteract = interactApis.find((api) => api.target === '#undo, #redo')
    expect(undoRedoInteract).toBeTruthy()

    const classList = {
      contains: (klass: string) => klass === 'hp',
    }
    const undoEvent = {
      target: { id: 'undo' },
      relatedTarget: { classList },
    }

    undoRedoInteract!.dropzoneConfig!.ondropactivate()
    undoRedoInteract!.dropzoneConfig!.ondragenter(undoEvent)
    expect(undoSpy).not.toHaveBeenCalled()

    hp.enemy--
    await nextTick()
    expect(hp.canUndo).toBe(true)

    undoRedoInteract!.dropzoneConfig!.ondropactivate()
    undoRedoInteract!.dropzoneConfig!.ondragenter(undoEvent)
    expect(undoSpy).toHaveBeenCalledTimes(1)

    undoRedoInteract!.dropzoneConfig!.ondragleave(undoEvent)
    expect(redoSpy).toHaveBeenCalledTimes(1)
  })
})
