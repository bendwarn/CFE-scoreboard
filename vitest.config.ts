import { defineVitestProject } from '@nuxt/test-utils/config'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.{test,spec}.ts', 'tests/composables/play.test.ts'],
          environment: 'node',
        },
      },
      {
        test: {
          name: 'e2e',
          include: ['tests/e2e/**/*.{test,spec}.ts'],
          environment: 'node',
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['tests/**/*.{test,spec}.ts'],
          exclude: ['tests/e2e/**', 'tests/unit/**', 'tests/composables/play.test.ts'],
        },
      }),
      './vitest.storybook.config.ts',
    ],
  },
})
