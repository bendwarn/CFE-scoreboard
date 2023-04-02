import type { PiniaPluginContext } from 'pinia'
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
    reactivePick(history, 'source', 'undoStack', 'redoStack'),
    {
      serializer: {
        read: parse,
        write: stringify,
      },
      mergeDefaults(depositObj, rawInit) {
        store.parse(depositObj.source)
        history.commit()
        history.undoStack.value = depositObj.undoStack
        history.redoStack.value = depositObj.redoStack
        return rawInit
      },
      listenToStorageChanges: false,
    }
  )
  const { canRedo, canUndo, redo, undo } = history
  return {
    canRedo,
    canUndo,
    redo,
    undo,
    reset() {
      history.batch((cancel) => {
        cancel()
        store.$reset()
        history.clear()
      })
    },
  }
}

export default defineNuxtPlugin(({ $pinia }) => {
  $pinia.use(piniaLocal)
})
