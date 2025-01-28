// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import pluginPrettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'
import pluginReact from 'eslint-plugin-react'
import pluginJest from 'eslint-plugin-jest'
import babelParser from '@babel/eslint-parser'

export default [
  // Base configuration for all JavaScript files
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      // Removed ecmaFeatures
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },

  // Configuration for Test Files
  {
    files: ['**/*.test.js', '**/*.spec.js', '**/__tests__/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.jest, // Include Jest globals
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      prettier: pluginPrettier,
      jest: pluginJest,
    },
    rules: {
      'prettier/prettier': 'error',
      // Example Jest-specific rules
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/valid-expect': 'error',
    },
  },

  // Configuration for React Frontend Files
  {
    files: ['frontend/src/**/*.js', 'frontend/src/**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: babelParser, // Use Babel ESLint parser
      parserOptions: {
        requireConfigFile: false, // Allows ESLint to run without a separate Babel config
        babelOptions: {
          presets: ['@babel/preset-react'], // Enable JSX parsing
        },
      },
    },
    plugins: {
      prettier: pluginPrettier,
      react: pluginReact,
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+
      'react/prop-types': 'off', // If you're not using PropTypes
      // Add other React-specific rules as needed
    },
  },

  // Extend ESLint Recommended Rules
  js.configs.recommended,

  // Disable ESLint rules that conflict with Prettier
  configPrettier,
]
