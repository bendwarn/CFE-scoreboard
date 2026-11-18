import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import Calculator from '../app/components/calculator.vue'
import { onMounted, ref } from 'vue'

const meta = {
  title: 'Scoreboard/Calculator',
  component: Calculator,
  args: { initial: '250', container: 'hp', onGiveResult: fn() },
  render: (args) => ({
    components: { Calculator },
    setup() {
      const calculator = ref<InstanceType<typeof Calculator>>()
      const open = () => (calculator.value?.$el as HTMLDialogElement).showModal()
      onMounted(open)
      return { args, calculator, open }
    },
    template: '<button type="button" @click="open">開啟計算機</button><Calculator ref="calculator" v-bind="args" />',
  }),
} satisfies Meta<typeof Calculator>
export default meta
type Story = StoryObj<typeof meta>
export const Health: Story = {}
export const Shield: Story = { args: { initial: '50', container: 'sp' } }
export const Calculate: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByLabelText('減號'))
    await userEvent.click(canvas.getByLabelText('數字 2'))
    await userEvent.click(canvas.getByLabelText('等於'))
    await waitFor(() => expect(args.onGiveResult).toHaveBeenCalledWith('248'))
  },
}
