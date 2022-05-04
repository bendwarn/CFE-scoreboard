import { Store } from 'pinia'
import { Vector2 } from '@vueuse/gesture'

export const swipeHistory = (history: Store, swipe: Vector2, memo: any) => {
  console.log(swipe, memo)
  if (swipe[0] < memo) {
    if (history.canRedo) {
      history.redo()
      return swipe[0]
    }
    return memo
  } else if (swipe[0] > memo) {
    if (history.canUndo) {
      history.undo()
      return swipe[0]
    }
    return memo
  }
  return memo
}
