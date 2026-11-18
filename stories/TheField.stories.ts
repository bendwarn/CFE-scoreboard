import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import { expect, userEvent } from 'storybook/test'
import TheField from '../app/components/TheField.vue'
import { element, useField } from '../app/composables/rules'
import { resetScoreboard } from './support/reset'

const meta = {
  title: 'Scoreboard/TheField',
  component: TheField,
  parameters: { layout: 'centered' },
  render: () => ({
    components: { TheField },
    setup() { resetScoreboard() },
    template: '<div style="padding: 80px"><TheField /></div>',
  }),
} satisfies Meta<typeof TheField>
export default meta
type Story = StoryObj<typeof meta>
export const Empty: Story = {}
export const Water: Story = {
  render: () => ({
    components: { TheField },
    setup() {
      resetScoreboard()
      useField().field = element.water
    },
    template: '<div style="padding: 80px"><TheField /></div>',
  }),
  play: async ({ canvasElement }) => {
    await userEvent.click(canvasElement.querySelector('.field > div')!)
    await expect(useField().field).toBeNull()
  },
}
