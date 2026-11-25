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
    // Let the initial hidden state and its translation styles reach the browser
    // before triggering Vue's enter transition.
    await waitFor(() => {
      expect(option).not.toBeVisible()
      expect(getComputedStyle(option).translate).not.toBe('none')
    })
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

    for (const opening of [true, false]) {
      const previousStarted = started
      const previousFinished = finished
      await userEvent.click(trigger)
      await waitFor(() => {
        expect(started).toBeGreaterThan(previousStarted)
        expect(finished).toBeGreaterThan(previousFinished)
      })
      if (opening) await expect(option).toBeVisible()
      else await expect(option).not.toBeVisible()
    }
  } finally {
    option.removeEventListener('transitionrun', onStart)
    option.removeEventListener('transitionend', onEnd)
  }
}
