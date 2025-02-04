module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'no-const-assign': 'error', // Prevents reassignment of `const` variables
    '@typescript-eslint/no-redeclare': 'error' // Prevents redeclaring variables
  }
};
