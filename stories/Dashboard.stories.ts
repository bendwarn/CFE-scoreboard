import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import Dashboard from '../app/components/Dashboard.vue'
import { opponent, useShield } from '../app/composables/rules'
import { resetScoreboard } from './support/reset'

const meta = {
  title: 'Scoreboard/Dashboard',
  component: Dashboard,
  args: {
    pos: opponent.friend,
    onReqCal: fn(),
  },
  render: (args) => ({
    components: { Dashboard },
    setup() {
      resetScoreboard()
      return { args }
    },
    template: '<Dashboard v-bind="args" style="width: min(400px, 100%); height: min(600px, 80vh)" />',
  }),
} satisfies Meta<typeof Dashboard>

export default meta
type Story = StoryObj<typeof meta>

export const HealthProgress: Story = {
  play: async ({ canvasElement, args }) => {
    const hp = canvasElement.querySelector<HTMLElement>('.hp')!
    const fill = hp.querySelector<HTMLElement>('.hp-fill')!
    const widths: number[] = []
    const observer = new MutationObserver(() => widths.push(parseFloat(fill.style.width)))
    observer.observe(fill, { attributes: true, attributeFilter: ['style'] })

    try {
      await expect(parseFloat(fill.style.width)).toBeCloseTo(100, 1)
      await userEvent.click(hp)
      await expect(args.onReqCal).toHaveBeenCalledWith(250, 'hp', expect.any(Function))
      args.onReqCal.mock.calls[0]![2]('125')

      await waitFor(() => expect(parseFloat(fill.style.width)).toBeCloseTo(50, 1), {
        timeout: 15_000,
      })
      await expect(widths.some((width) => width > 50 && width < 100)).toBe(true)
      await expect(hp).toHaveTextContent('125')
    } finally {
      observer.disconnect()
    }
  },
}

export const InvalidHealthResult: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvasElement.querySelector('.hp')!)
    await expect(args.onReqCal).toHaveBeenCalledWith(250, 'hp', expect.any(Function))
    const handler = args.onReqCal.mock.calls[0]![2]
    handler('abc')
    await waitFor(() => expect(canvas.getByText('計算結果為 NaN')).toBeVisible())
  },
}

export const UpdateShield: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(canvasElement.querySelector('.shield')!)
    await expect(args.onReqCal).toHaveBeenCalledWith(0, 'sp', expect.any(Function))
    const handler = args.onReqCal.mock.calls[0]![2]
    handler('77')
    await waitFor(() => expect(useShield().enemy[0]).toBe(77))
  },
}
