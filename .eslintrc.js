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
    '**/node_modules/*',
    '**/tests/*'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    indent: ['error', 2, {
      SwitchCase: 1,
      MemberExpression: 1,
      VariableDeclarator: {
        var: 2,
        let: 2,
        const: 3
      },
      FunctionDeclaration: {
        body: 1,
        parameters: 2
      },
      ObjectExpression: 1,
      ImportDeclaration: 1
    }],
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
