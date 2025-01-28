// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import pluginPrettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

export default [
  // Configuration for all JavaScript files
  {
    files: ['**/*.js'], // All JS files
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      // Make Prettier formatting errors show up as ESLint errors:
      'prettier/prettier': 'error',
    },
  },

  // Configuration for test files
  {
    files: ['**/*.test.js', '**/*.spec.js', '**/__tests__/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.jest, // Add Jest globals to these test files
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      // Make Prettier formatting errors show up as ESLint errors:
      'prettier/prettier': 'error',
    },
  },

  // Extend recommended ESLint rules
  js.configs.recommended,

  // Disable rules that conflict with Prettier:
  configPrettier,
]
