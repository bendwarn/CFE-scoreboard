import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt(
  {},
  { ignores: ['calcu/pkg/'] },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/attributes-order': 'off',
      'vue/html-self-closing': 'off',
      'vue/multi-word-component-names': ['error', {
        ignores: ['Dashboard', 'Gear', 'Spirits', 'calculator'],
      }],
    },
  },
  {
    files: ['app/components/StarTeam.vue'],
    rules: { 'vue/require-toggle-inside-transition': 'off' },
  },
  {
    files: [
      'app/app.vue',
      'app/components/Dashboard.vue',
      'app/composables/rules.ts',
      'tests/app.test.ts',
      'tests/composables/pinia-history.test.ts',
    ],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
)
