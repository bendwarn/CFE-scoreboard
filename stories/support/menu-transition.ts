import { expect, userEvent, waitFor } from 'storybook/test'

export async function expectMenuTransition(trigger: Element, option: Element) {
  let started = 0
  let finished = 0
  const onStart = (event: Event) => {
    if ((event as TransitionEvent).propertyName === 'translate') started++
  }
  const onEnd = (event: Event) => {
    if ((event as TransitionEvent).propertyName === 'translate') finished++
  }

  option.addEventListener('transitionrun', onStart)
  option.addEventListener('transitionend', onEnd)
  try {
    for (const count of [1, 2]) {
      await userEvent.click(trigger)
      await waitFor(() => {
        expect(started).toBe(count)
        expect(finished).toBe(count)
      })
    }
  } finally {
    option.removeEventListener('transitionrun', onStart)
    option.removeEventListener('transitionend', onEnd)
  }
}
