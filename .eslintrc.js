module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  ignorePatterns: [
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
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        format: [
          'camelCase',
          'strictCamelCase',
          'PascalCase',
          'StrictPascalCase',
          'snake_case',
          'UPPER_CASE'
        ],
        leadingUnderscore: 'allow',
        selector: 'default',
        trailingUnderscore: 'allow'
      }
    ],
    camelcase: 'off',
    indent: ['error', 2, {
      FunctionDeclaration: {
        body: 1,
        parameters: 2
      },
      ImportDeclaration: 1,
      MemberExpression: 1,
      ObjectExpression: 1,
      SwitchCase: 1,
      VariableDeclarator: {
        const: 3,
        let: 2,
        var: 2
      }
    }],
    'no-console': 'off',
    'no-control-regex': 'off',
    'no-debugger': 'off'
    // 'sort-keys-fix/sort-keys-fix': 'warn'
  }
}
