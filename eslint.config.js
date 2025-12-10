import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'test-results/**',
      'playwright-report/**',
      '*.config.ts',
      '*.config.js',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.ts'],
    plugins: {
      playwright,
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    rules: {
      // Prevent skipping tests - CRITICAL
      'playwright/no-skipped-test': 'error',
      'playwright/no-focused-test': 'error',
      
      // Prevent skipping code
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': true,
          'ts-nocheck': true,
          'ts-check': false,
        },
      ],
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error', 'debug', 'info'],
        },
      ],
      
      // TypeScript best practices
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      
      // Code quality rules
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'curly': ['error', 'all'],
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'error',
      
      // Best practices
      'no-return-await': 'off',
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],
      'no-else-return': 'warn',
      'no-lonely-if': 'warn',
      'prefer-template': 'error',
      'object-shorthand': 'error',
      'prefer-destructuring': [
        'warn',
        {
          array: false,
          object: true,
        },
      ],
      
      // Import/export rules
      'no-duplicate-imports': 'error',
      
      // Playwright specific
      'playwright/expect-expect': 'error',
      'playwright/missing-playwright-await': 'error',
      'playwright/no-page-pause': 'error',
      'playwright/no-wait-for-timeout': 'error',
      'playwright/valid-expect': 'error',
    },
  },
  {
    files: ['*.spec.ts', '*.test.ts'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  }
);
