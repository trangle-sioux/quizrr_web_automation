module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['jest', '@typescript-eslint'],
  rules: {
    'linebreak-style': 0,
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        arrowParens: 'avoid',
      },
    ],
    'arrow-parens': ['error', 'as-needed'],
    'global-require': 0,
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-underscore-dangle': [
      'error',
      {
        allowAfterThis: true,
        allow: [
          '_doc',
          '_id',
          '_find',
          '_get',
          '_create',
          '_update',
          '_patch',
          '_remove',
        ],
      },
    ],
    'space-before-function-paren': 0,
    '@typescript-eslint/space-before-function-paren': 0,
    '@typescript-eslint/indent': 0,
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external']],
        'newlines-between': 'always',
      },
    ],
    'no-use-before-define': 0, // It's only valuable before ES6
    'no-param-reassign': 0,
    'no-restricted-syntax': [
      // Reference: https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js#L339
      // Discussion: https://github.com/airbnb/javascript/issues/1271
      'error',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    'no-console': 0,
    radix: ['error', 'as-needed'],
    'func-names': 0,
    'import/prefer-default-export': 0,
    'class-methods-use-this': 0,
    '@typescript-eslint/brace-style': 0, // conflicts with prettier
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['variable'],
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
      },
    ],
  },
};
