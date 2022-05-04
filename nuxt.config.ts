import { defineNuxtConfig } from 'nuxt'

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
  modules: ['@vueuse/nuxt', '@nuxtjs/tailwindcss', '@pinia/nuxt'],
  app: {
    // baseURL: '/CFE-scoreboard/',
    baseURL: '',
    buildAssetsDir: './_nuxt/',
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
  typescript: {
    shim: false,
    strict: true,
  },
})
