import { defineNuxtPlugin } from '#app'
import { PiniaPluginContext, storeToRefs } from 'pinia'
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    canRedo: boolean
    canUndo: boolean
    redo: () => void
    undo: () => void
    clear: () => void
  }
}

function piniaLocal({ store }: PiniaPluginContext) {
  const isExist = localStorage.getItem(store.$id)
  const ls = useLocalStorage<object>(store.$id, store.$state)
  // store.$id == 'shield' && console.log(toPlainObject(store.$state))
  isExist && store.parse?.(ls.value)
  const reset = store.$reset
  store.$reset = () => {
    reset()
    ls.value = store.$state
  }
  store.$subscribe((mutations, state) => {
    ls.value = state
  })
}

function piniaHistory({ store }: PiniaPluginContext) {
  const { canRedo, canUndo, redo, undo, clear } = useRefHistory(
    ref(storeToRefs(store))
  )
  return { canRedo, canUndo, redo, undo, clear }
}

export default defineNuxtPlugin(({ $pinia }) => {
  $pinia.use(piniaLocal)
  $pinia.use(piniaHistory)
})
