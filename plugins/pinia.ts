import { defineNuxtPlugin } from '#app'
import { PiniaPluginContext } from 'pinia'
import { parse, stringify } from 'flatted'

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
  const history = useRefHistory(ref(store.$state), {
    deep: true,
    dump: stringify,
    parse(text) {
      store.parse(parse(text))
      return store.$state
    },
  })
  const ls = useLocalStorage(
    store.$id,
    ref(reactivePick(history, 'source', 'undoStack', 'redoStack')),
    {
      serializer: {
        read: parse,
        write: stringify,
      },
    }
  )
  if (isExist) {
    store.parse(ls.value.source)
    history.undoStack.value = ls.value.undoStack
    history.redoStack.value = ls.value.redoStack
    ls.value.source = history.source
  }
  store.reset = () => {
    store.$reset()
    history.clear()
  }
  const { canRedo, canUndo, redo, undo, clear } = history
  return { canRedo, canUndo, redo, undo, clear }
}

export default defineNuxtPlugin(({ $pinia }) => {
  $pinia.use(piniaLocal)
})
