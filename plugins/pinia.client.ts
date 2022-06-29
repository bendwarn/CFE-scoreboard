import { defineNuxtPlugin } from '#app'
import { PiniaPluginContext } from 'pinia'
import { parse, stringify } from 'flatted'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    canRedo: boolean
    canUndo: boolean
    redo: () => void
    undo: () => void
    reset: () => void
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
    history.pause()
    history.undoStack.value = ls.value.undoStack
    history.redoStack.value = ls.value.redoStack
    store.parse(ls.value.source)
    // console.log(ls.value.undoStack)
    ls.value.source = history.source
    history.resume()
  }
  const { canRedo, canUndo, redo, undo } = history
  return {
    canRedo,
    canUndo,
    redo,
    undo,
    reset() {
      history.pause()
      store.$reset()
      history.clear()
      history.resume()
    },
  }
}

export default defineNuxtPlugin(({ $pinia }) => {
  $pinia.use(piniaLocal)
})
