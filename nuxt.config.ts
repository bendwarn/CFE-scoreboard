import { defineNuxtConfig } from 'nuxt'
import { VitePWA } from 'vite-plugin-pwa'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
  },
  app: {
    // baseURL: '/CFE-scoreboard/',
    buildAssetsDir: 'assets',
    cdnURL: 'https://bendwarn.github.io/CFE-scoreboard/',
    head: {
      meta: [
        {
          'http-equiv': 'X-UA-Compatible',
          content: 'IE=edge',
        },
        {
          name: 'description',
          content:
            'A board recording information about playing the card game of chinese five elements. 五行戰鬥牌計算機。',
        },
        { name: 'theme-color', content: '#eae6d1' },
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://bendwarn.github.io/CFE-scoreboard/',
        },
        { rel: 'icon', href: '32.ico' },
        {
          rel: 'apple-touch-icon',
          href: '180.png',
        },
        { rel: 'manifest', href: 'manifest.json' },
      ],
    },
  },
  modules: ['@vueuse/nuxt', '@nuxtjs/tailwindcss', '@pinia/nuxt'],
  nitro: {
    output: {
      dir: '~/docs',
      serverDir: '~/.output/server',
      publicDir: '~/docs',
    },
  },
  vite: { plugins: [VitePWA({ registerType: 'autoUpdate' })] },
  typescript: {
    shim: false,
    strict: true,
  },
})
