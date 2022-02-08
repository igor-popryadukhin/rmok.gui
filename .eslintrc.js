module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },

  extends: [
    'plugin:vue/recommended',
    '@vue/typescript/recommended'
  ],

  ignorePatterns: [
    'node_modules',
    '**/node_modules/*',
    '**/tests/*'
  ],

  parserOptions: {
    ecmaVersion: 2020
  },

  plugins: [
    // 'sort-keys-fix'
  ],

  root: true,

  rules: {},

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
