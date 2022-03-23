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

  rules: {
    "@typescript-eslint/no-this-alias": [
      "error",
      {
        "allowDestructuring": true, // Allow `const { props, state } = this`; false by default
        "allowedNames": ["vm"] // Allow `const vm= this`; `[]` by default
      }
    ]
  },

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
