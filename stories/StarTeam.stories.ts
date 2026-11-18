import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import StarTeam from '../app/components/StarTeam.vue'
import { element, opponent, useStar } from '../app/composables/rules'
import { resetScoreboard } from './support/reset'

const meta = {
  title: 'Scoreboard/StarTeam',
  component: StarTeam,
  args: { pos: opponent.friend },
  parameters: { layout: 'centered' },
  render: (args) => ({
    components: { StarTeam },
    setup() {
      resetScoreboard()
      return { args }
    },
    template: '<StarTeam v-bind="args" />',
  }),
} satisfies Meta<typeof StarTeam>
export default meta
type Story = StoryObj<typeof meta>
export const Empty: Story = {}
export const Fire: Story = {
  render: (args) => ({
    components: { StarTeam },
    setup() {
      resetScoreboard()
      useStar()[args.pos].type = element.fire
      return { args }
    },
    template: '<StarTeam v-bind="args" />',
  }),
}
