module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'no-const-assign': 'warning', // Prevents reassignment of `const` variables
    '@typescript-eslint/no-redeclare': 'warning' // Prevents redeclaring variables
  }
};
