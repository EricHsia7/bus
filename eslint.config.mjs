import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      'no-const-assign': 'warn',

      // Object Methods
      'no-prototype-builtins': 'warn',

      // Code Style
      'prefer-const': 'warn',
      'no-var': 'off',
      'no-case-declarations': 'warn',
      'no-useless-escape': 'off',
      'no-constant-binary-expression': 'warn',

      // TypeScript Specific
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-redeclare': 'warn',

      // Functions
      'no-async-promise-executor': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'off'
    }
  }
);
