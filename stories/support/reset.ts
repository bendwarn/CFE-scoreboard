import {
  useField,
  useHealth,
  usePeople,
  useShield,
  useSpirit,
  useStar,
} from '../../app/composables/rules'

// Each story starts from the same state without clearing Storybook's own preferences.
export function resetScoreboard() {
  for (const key of ['people', 'health', 'shield', 'spirit', 'star', 'field']) {
    localStorage.removeItem(key)
  }
  usePeople().reset()
  useHealth().reset()
  useShield().reset()
  useSpirit().reset()
  useStar().reset()
  useField().reset()
}
