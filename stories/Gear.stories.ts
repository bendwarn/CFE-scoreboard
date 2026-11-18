import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import Gear from '../app/components/Gear.vue'

const meta = {
  title: 'Scoreboard/Gear',
  component: Gear,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Gear>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(canvasElement.querySelector('.gear')!)
    await waitFor(() =>
      expect(within(canvasElement).getByText('將齒輪拉到場地來初始化')).toBeVisible(),
    )
  },
}
