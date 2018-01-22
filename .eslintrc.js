const path = require('path');

module.exports = {
  env: {
    browser: false,
    node: true,
    mocha: true,
  },
  extends: 'airbnb-base',
  plugins: [
    'standard',
    'promise',
  ],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          path.join(__dirname, 'test/**'),
        ],
      },
    ],
    'prefer-destructuring': 'warn',
    'function-paren-newline': 'off',
    'object-curly-newline': 'off',
    'one-var': 'off',
    'no-mixed-operators': 'off',
    'arrow-body-style': 'off',
    'brace-style': 'off',
    'padded-blocks': 'off',
    'no-plusplus': 'off',
    'arrow-spacing': 'off',
    'object-curly-spacing': 'off',
    'prefer-const': 'warn',
    'no-unused-vars': 'warn',
    'object-shorthand': 'warn',
    'no-param-reassign': 'warn',
    'no-console': 'warn',
    'newline-per-chained-call': 'off',
    'no-continue': 'off',
    'no-multi-spaces': 'off',
    'max-len': [
      'error',
      140,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
  },
};
