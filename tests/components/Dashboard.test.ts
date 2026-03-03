// @vitest-environment nuxt
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Dashboard from '../../app/components/Dashboard.vue'

type InteractApi = {
  target: unknown
  onHandlers: Record<string, () => void>
  dropzoneConfig?: Record<string, any>
  draggable: () => InteractApi
  dropzone: (config: Record<string, any>) => InteractApi
  gesturable: (config: Record<string, any>) => InteractApi
  on: (event: string, handler: () => void) => InteractApi
  unset: () => InteractApi
}

const interactApis: InteractApi[] = []

vi.mock('interactjs', () => ({
  default: vi.fn((target: unknown) => {
    const api: InteractApi = {
      target,
      onHandlers: {},
      draggable: () => api,
      dropzone: (config) => {
        api.dropzoneConfig = config
        return api
      },
      gesturable: () => api,
      on: (event, handler) => {
        api.onHandlers[event] = handler
        return api
      },
      unset: () => api,
    }
    interactApis.push(api)
    return api
  }),
}))

describe('Dashboard', () => {
  beforeEach(() => {
    interactApis.length = 0
    localStorage.clear()
    usePeople().reset()
    useHealth().reset()
    useShield().reset()
  })

  it('should emit hp calculator request and show NaN warning for invalid payload', async () => {
    const wrapper = await mountSuspended(Dashboard, {
      props: { pos: 'enemy' as opponent },
      global: {
        stubs: {
          Spirits: true,
          StarPersonal: true,
          StarTeam: true,
        },
      },
    })

    const hpInteract = interactApis.find((api) => api.dropzoneConfig?.accept === '.hp')
    expect(hpInteract).toBeTruthy()
    hpInteract!.onHandlers.click()

    const hpEmit = wrapper.emitted('reqCal')![0] as [
      initial: number,
      category: string,
      handler: (v: string) => void,
    ]
    expect(hpEmit[1]).toBe('hp')

    hpEmit[2]('abc')
    await nextTick()
    expect(wrapper.text()).toContain('計算結果為 NaN')
  })

  it('should emit shield calculator request and apply valid payload', async () => {
    const wrapper = await mountSuspended(Dashboard, {
      props: { pos: 'enemy' as opponent },
      global: {
        stubs: {
          Spirits: true,
          StarPersonal: true,
          StarTeam: true,
        },
      },
    })

    const hpInteract = interactApis.find((api) => api.dropzoneConfig?.accept === '.hp')
    const shieldInteract = interactApis.find(
      (api) => api !== hpInteract && typeof api.onHandlers.click === 'function',
    )
    expect(shieldInteract).toBeTruthy()
    shieldInteract!.onHandlers.click()

    const shieldEmit = wrapper.emitted('reqCal')![0] as [
      initial: number,
      category: string,
      handler: (v: string) => void,
    ]
    expect(shieldEmit[1]).toBe('sp')

    shieldEmit[2]('77')
    expect(useShield().enemy[0]).toBe(77)
  })
})
