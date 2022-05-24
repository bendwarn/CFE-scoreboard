import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  app: {
    buildAssetsDir: 'assets',
    cdnURL: 'https://bendwarn.github.io/CFE-scoreboard/',
    head: {
      meta: [
        {
          'http-equiv': 'X-UA-Compatible',
          content: 'IE=edge',
        },
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, minimal-ui',
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://bendwarn.github.io/CFE-scoreboard/',
        },
        { rel: 'icon', href: '32.ico' },
      ],
    },
  },
  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@kevinmarrec/nuxt-pwa',
  ],
  nitro: {
    output: {
      dir: '~/.output',
      serverDir: '~/.output/server',
      publicDir: '~/docs',
    },
  },
  typescript: {
    shim: false,
    strict: true,
  },
  pwa: {
    manifest: {
      background_color: '#eae6d1',
      start_url: '/CFE-scoreboard',
      theme_color: '#eae6d1',
    },
  },
})
