// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  app: {
    baseURL: '/CFE-scoreboard/',
    head: {
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
      meta: [
        {
          'http-equiv': 'X-UA-Compatible',
          content: 'IE=edge',
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
    '@vueuse/motion/nuxt',
    '@pinia/nuxt',
    '@unocss/nuxt',
    '@vite-pwa/nuxt',
    '@nuxt/test-utils/module',
  ],
  typescript: {
    typeCheck: true,
  },
  pwa: {
    manifest: {
      background_color: '#eae6d1',
      start_url: '/CFE-scoreboard/',
      theme_color: '#eae6d1',
    },
  },
  nitro: { preset: 'github-pages' },
  devtools: { enabled: true },
})
