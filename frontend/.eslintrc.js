// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  env: {
    // 'jest/globals': true,
    browser: true,
    es2021: true,
  },
  // plugins: ['prettier', 'jest', 'cypress'],
  plugins: ['prettier', 'cypress'],
  extends: [
    'eslint:recommended',
    // 'plugin:jest/recommended',
    'plugin:cypress/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-var': 'error',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'cypress/no-unnecessary-waiting': 'warn',
  },
}
