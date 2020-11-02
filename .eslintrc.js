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
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-control-regex': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
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
