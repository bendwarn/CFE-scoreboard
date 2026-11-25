import type { StorybookConfig } from '@nuxtjs/storybook'
import type { Stats } from 'node:fs'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-vitest'],
  features: { experimentalDocgenServer: true },
  framework: {
    name: '@storybook-vue/nuxt',
    options: {},
  },
  async viteFinal(config, { configType }) {
    // The Nuxt preset contributes a production NODE_ENV even to Storybook's dev server.
    if (configType === 'DEVELOPMENT') {
      config.define = { ...config.define, 'process.env.NODE_ENV': JSON.stringify('development') }
    }
    config.plugins ??= []
    config.plugins.push({
      name: 'storybook:nuxt-preview-base',
      enforce: 'post',
      transform(code, id) {
        if (id === '\0virtual:nuxt-runtime-config') {
          // Storybook is served independently of the Nuxt site's base URL.
          return `${code}\nruntimeConfig.app.baseURL = new URL('.', window.location.href).pathname\n`
        }
      },
    })
    const watch = config.server?.watch
    // Nuxt ignores story files, but Storybook needs to watch them for HMR.
    if (configType === 'DEVELOPMENT' && watch && Array.isArray(watch.ignored)) {
      config.server = {
        ...config.server,
        watch: {
          ...watch,
          ignored: watch.ignored.map((rule) =>
            typeof rule === 'function'
              ? (file: string, stats?: Stats) =>
                  /\.stories\.[cm]?[jt]sx?$/.test(file)
                    ? false
                    : (rule as (file: string, stats?: Stats) => boolean)(file, stats)
              : rule,
          ),
        },
      }
    }
    config.optimizeDeps ??= {}
    // The Nuxt preset adds optional docs dependencies that cannot be resolved
    // from this pnpm workspace; Vite does not need to pre-bundle them here.
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include ?? []).filter((dependency) => ![
        '@nuxtjs/storybook > @storybook-vue/nuxt > @storybook/vue3 > lodash/kebabCase',
        'react/jsx-runtime',
        'react',
        'react-dom/client',
      ].includes(dependency)),
      'vue-digit-animation > numeral',
      'interactjs',
    ]
    return config
  },
}

export default config
