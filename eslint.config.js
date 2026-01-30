import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react',
              importNames: ['useImperativeHandle', 'forwardRef'],
              message:
                '🚫 IMPERATIVE PATTERNS FORBIDDEN: Use declarative props (isOpen, onClose) instead of imperative APIs (ref.open(), ref.close()). Components must be controlled via props only.',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "Identifier[name='useImperativeHandle']",
          message:
            '🚫 IMPERATIVE PATTERNS FORBIDDEN: useImperativeHandle creates imperative APIs. Use declarative props instead (e.g., isOpen={true} instead of ref.open()).',
        },
        {
          selector: "Identifier[name='forwardRef']",
          message:
            '🚫 IMPERATIVE PATTERNS FORBIDDEN: forwardRef is typically used for imperative APIs. Use declarative props to control component state.',
        },
      ],
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', '*.config.ts', '*.config.js'],
  },
];
