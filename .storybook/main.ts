import type { StorybookConfig } from '@nuxtjs/storybook'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-vitest'],
  framework: {
    name: '@storybook-vue/nuxt',
    options: {},
  },
  async viteFinal(config) {
    config.optimizeDeps ??= {}
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include ?? []),
      'vue-digit-animation > numeral',
      'interactjs',
    ]
    return config
  },
}

export default config
