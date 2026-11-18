import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import Spirits from '../app/components/Spirits.vue'
import { element, opponent, useSpirit } from '../app/composables/rules'
import { resetScoreboard } from './support/reset'

const meta = {
  title: 'Scoreboard/Spirits',
  component: Spirits,
  args: { pos: opponent.friend, index: 0 },
  parameters: { layout: 'centered' },
  render: (args) => ({
    components: { Spirits },
    setup() {
      resetScoreboard()
      return { args }
    },
    template: '<div style="width: min(280px, 80vw); padding: 70px 0"><Spirits v-bind="args" /></div>',
  }),
} satisfies Meta<typeof Spirits>
export default meta
type Story = StoryObj<typeof meta>
export const Empty: Story = {}
export const Active: Story = {
  render: (args) => ({
    components: { Spirits },
    setup() {
      resetScoreboard()
      useSpirit()[args.pos][args.index]!.type = element.fire
      useSpirit()[args.pos][args.index]!.point = 3
      return { args }
    },
    template: '<div style="width: min(280px, 80vw); padding: 70px 0"><Spirits v-bind="args" /></div>',
  }),
}
