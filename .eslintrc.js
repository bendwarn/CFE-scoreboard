module.exports = {
    extends: [
        'standard',
        "plugin:vue/base"
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaFeatures: {
            jsx: false
        }
    },
    rules: {
        eqeqeq: 'off',
        'space-before-function-paren': ['error', 'never'],
        'no-unused-vars': 'off',
        // '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        yoda: 'off'
    }
}
