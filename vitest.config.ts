import { defineVitestConfig } from '@nuxt/test-utils/config'
import { defineConfig } from 'vitest/config'

export default defineConfig(async (env) => {
  // Preserve Nuxt's generated test projects while adding the browser-based stories.
  const config = await defineVitestConfig({})(env)
  config.test!.projects!.push('./vitest.storybook.config.ts')
  return config
})
