import js from '@eslint/js'
import globals from 'globals'
import pluginPrettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

export default [
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
  },
  {
    files: ['**/*.test.js', '**/*.spec.js', '**/__tests__/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jest, // Add Jest only to these test files
      },
    },
  },
  js.configs.recommended,

  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      // Make Prettier formatting errors show up as ESLint errors:
      'prettier/prettier': 'error',
    },
  },

  // 2) Disable rules that conflict with Prettier:
  configPrettier,
]
