import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import { expect, userEvent } from 'storybook/test'
import StarPersonal from '../app/components/StarPersonal.vue'
import { element, opponent, useStar } from '../app/composables/rules'
import { resetScoreboard } from './support/reset'

const meta = {
  title: 'Scoreboard/StarPersonal',
  component: StarPersonal,
  args: { pos: opponent.friend, index: 0 },
  parameters: { layout: 'centered' },
  render: (args) => ({
    components: { StarPersonal },
    setup() {
      resetScoreboard()
      return { args }
    },
    template: '<div style="width: min(250px, 80vw)"><StarPersonal v-bind="args" /></div>',
  }),
} satisfies Meta<typeof StarPersonal>
export default meta
type Story = StoryObj<typeof meta>
export const SelectStar: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(canvasElement.querySelectorAll('.icon-star')[1]!)
    await expect(useStar().enemy.type).toBe(element.fire)
  },
}
