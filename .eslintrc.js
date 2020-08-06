module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaFeatures: {
      jsx: false,
    },
  },
  ignorePatterns: ['/node_modules/*', '/bower_components/*', '.eslint*'],
  extends: ['plugin:vue/essential', 'prettier', 'prettier/vue', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    eqeqeq: 'off',
    'no-unused-vars': 'off',
    'lines-between-class-members': 'off',
    // '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    yoda: 'off',
  },
}
