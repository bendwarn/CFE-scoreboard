import type { Preview } from '@storybook-vue/nuxt'
import { INITIAL_VIEWPORTS } from 'storybook/viewport'
import './preview.css'

const preview: Preview = {
  parameters: {
    viewport: { options: INITIAL_VIEWPORTS },
  },
}

export default preview
