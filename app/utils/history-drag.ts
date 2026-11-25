import type interact from 'interactjs'
import type { InjectionKey } from 'vue'

export const historyDragKey: InjectionKey<(target: ReturnType<typeof interact>) => void> =
  Symbol('historyDrag')
