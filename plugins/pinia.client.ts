import type { PiniaPluginContext, Pinia } from 'pinia'
import { parse, stringify } from 'flatted'
import { timestamp } from '@vueuse/shared'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    canRedo: Ref<boolean>
    canUndo: Ref<boolean>
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
      history.batch((cancel) => {
        cancel()
        // const da = parse(text)
        // console.dir(da)
        store.parse(parse(text))
      })
      // console.dir(store.$state)
      return store.$state
    },
  })
  useLocalStorage(store.$id, reactivePick(history, 'source', 'undoStack', 'redoStack'), {
    serializer: {
      read: parse,
      write: stringify,
    },
    mergeDefaults(depositObj, rawInit) {
      function _createHistoryRecord() {
        return markRaw({
          snapshot: stringify(depositObj.source),
          timestamp: timestamp(),
        })
      }
      history.batch((cancel) => {
        cancel()
        store.parse(depositObj.source)
        history.last.value = _createHistoryRecord()
        history.undoStack.value = depositObj.undoStack
        history.redoStack.value = depositObj.redoStack
      })
      return rawInit
    },
  })
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
  ;($pinia as Pinia).use(piniaLocal)
})
