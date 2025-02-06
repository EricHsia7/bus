module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'no-const-assign': 'warn', // Prevents reassignment of `const` variables

    // Object Methods
    'no-prototype-builtins': 'warn',

    // Code Style
    'prefer-const': 'warn',
    'no-var': 'warn',
    'no-case-declarations': 'warn',
    'no-useless-escape': 'warn',
    'no-constant-binary-expression': 'warn',

    // TypeScript Specific
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-require-imports': 'warn',
    '@typescript-eslint/no-empty-object-type': 'warn',
    '@typescript-eslint/no-redeclare': 'warn',

    // Functions
    'no-async-promise-executor': 'warn',
    '@typescript-eslint/no-unsafe-function-type': 'warn'
  }
};
