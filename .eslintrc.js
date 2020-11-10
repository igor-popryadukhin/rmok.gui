module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  ignorePatterns: [
    '**/node_modules/*'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-control-regex': 'off',
    'no-console': 'off',
    'no-debugger': 'off',
    camelcase: 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: [
          'camelCase',
          'strictCamelCase',
          'PascalCase',
          'StrictPascalCase',
          'snake_case',
          'UPPER_CASE'
        ],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow'
      }
    ]
  }
}
