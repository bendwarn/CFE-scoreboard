import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import App from '../app/app.vue'
import { resetScoreboard } from './support/reset'

const meta = {
  title: 'Scoreboard/完整記分板',
  component: App,
  parameters: { layout: 'fullscreen' },
  render: () => ({
    components: { App },
    setup() { resetScoreboard() },
    template: '<App />',
  }),
} satisfies Meta<typeof App>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
