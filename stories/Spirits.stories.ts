import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import { expect, userEvent, waitFor } from 'storybook/test'
import Spirits from '../app/components/Spirits.vue'
import { element, opponent, useSpirit } from '../app/composables/rules'
import { resetScoreboard } from './support/reset'
import { expectMenuTransition } from './support/menu-transition'

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

export const MenuTransition: Story = {
  play: async ({ canvasElement }) => {
    const icons = canvasElement.querySelectorAll('.spirit .icon-ghost')
    await expectMenuTransition(icons[0]!, icons[1]!.parentElement!)
  },
}

export const MenuFollowsSpirit: Story = {
  play: async ({ canvasElement }) => {
    const icons = canvasElement.querySelectorAll<HTMLElement>('.spirit .icon-ghost')
    const trigger = icons[0]!
    const option = icons[1]!.parentElement!
    const centerX = (element: Element) => {
      const { left, width } = element.getBoundingClientRect()
      return left + width / 2
    }
    const expectAligned = () => expect(centerX(option)).toBeCloseTo(centerX(trigger), 0)

    await userEvent.click(trigger)
    await waitFor(() => expectAligned())
    const initialCenter = centerX(trigger)

    useSpirit()[opponent.friend][0]!.point = 3
    await waitFor(() => expect(centerX(trigger)).not.toBeCloseTo(initialCenter, 0))
    await waitFor(() => expectAligned())

    useSpirit()[opponent.friend][0]!.point = 0
    await waitFor(() => expect(centerX(trigger)).toBeCloseTo(initialCenter, 0))
    await waitFor(() => expectAligned())

    await userEvent.click(icons[2]!)
    await expect(useSpirit()[opponent.friend][0]!.type).toBe(element.fire)
    await expect(useSpirit()[opponent.friend][0]!.point).toBe(2)
    await waitFor(() => expect(option).not.toBeVisible())
  },
}
