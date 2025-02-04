module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'no-const-assign': 'warn', // Prevents reassignment of `const` variables
    '@typescript-eslint/no-redeclare': 'warn' // Prevents redeclaring variables
  }
};
