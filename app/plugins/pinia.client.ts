import type { PiniaPluginContext, Pinia } from 'pinia'
import { parse, stringify } from 'flatted'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    canRedo: ComputedRef<boolean>
    canUndo: ComputedRef<boolean>
    redo: () => void
    undo: () => void
    reset: () => void
  }
}

function piniaLocal({ store }: PiniaPluginContext) {
  const safeParse = <T>(text: string, fallback: T): T => {
    try {
      return parse(text) as T
    } catch {
      return fallback
    }
  }

  const history = useRefHistory(ref(store.$state), {
    deep: true,
    dump: stringify,
    parse(text) {
      history.batch((cancel) => {
        cancel()
        const snapshot = safeParse<Record<string, unknown> | null>(text, null)
        if (snapshot && typeof snapshot === 'object') {
          store.parse(snapshot)
        }
      })
      return store.$state
    },
  })
  useLocalStorage(store.$id, reactivePick(history, 'source', 'undoStack', 'redoStack'), {
    serializer: {
      read: (text) => safeParse(text, {}),
      write: stringify,
    },
    mergeDefaults(depositObj, rawInit) {
      if (!depositObj || typeof depositObj !== 'object') {
        return rawInit
      }

      const source =
        'source' in depositObj && depositObj.source && typeof depositObj.source === 'object'
          ? depositObj.source
          : null
      if (!source) {
        return rawInit
      }

      const undoStack =
        'undoStack' in depositObj && Array.isArray(depositObj.undoStack)
          ? depositObj.undoStack
          : []
      const redoStack =
        'redoStack' in depositObj && Array.isArray(depositObj.redoStack)
          ? depositObj.redoStack
          : []

      function _createHistoryRecord() {
        return markRaw({
          snapshot: stringify(source),
          timestamp: Date.now(),
        })
      }
      history.batch((cancel) => {
        cancel()
        store.parse(source)
        history.last.value = _createHistoryRecord()
        history.undoStack.value = undoStack
        history.redoStack.value = redoStack
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
