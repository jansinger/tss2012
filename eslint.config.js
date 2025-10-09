import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import prettier from 'eslint-config-prettier';

export default [
	// Ignore patterns
	{
		ignores: [
			'*.cjs',
			'.svelte-kit/**',
			'.netlify/**',
			'build/**',
			'dist/**',
			'node_modules/**',
			'package/**',
			'.DS_Store',
			'coverage/**'
		]
	},

	// Base ESLint recommended config
	js.configs.recommended,

	// TypeScript files
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 2020
			},
			globals: {
				// Browser globals
				window: 'readonly',
				document: 'readonly',
				navigator: 'readonly',
				console: 'readonly',
				HTMLElement: 'readonly',
				HTMLDivElement: 'readonly',
				HTMLImageElement: 'readonly',
				HTMLAnchorElement: 'readonly',
				Element: 'readonly',
				Event: 'readonly',
				MouseEvent: 'readonly',
				KeyboardEvent: 'readonly',
				WheelEvent: 'readonly',
				PointerEvent: 'readonly',
				UIEvent: 'readonly',
				Window: 'readonly',
				// Node globals
				process: 'readonly',
				global: 'readonly',
				__dirname: 'readonly',
				__filename: 'readonly',
				module: 'readonly',
				require: 'readonly',
				setTimeout: 'readonly',
				setImmediate: 'readonly',
				// ES2017 globals
				Promise: 'readonly',
				Map: 'readonly',
				Set: 'readonly'
			}
		},
		plugins: {
			'@typescript-eslint': tseslint
		},
		rules: {
			...tseslint.configs.recommended.rules,
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-function-type': 'off'
		}
	},

	// Test files with Vitest globals
	{
		files: ['**/*.spec.ts', '**/*.test.ts', '**/vitest-setup.js', '**/test-utils.ts'],
		languageOptions: {
			globals: {
				// Vitest globals
				vi: 'readonly',
				describe: 'readonly',
				it: 'readonly',
				expect: 'readonly',
				test: 'readonly',
				beforeEach: 'readonly',
				afterEach: 'readonly',
				beforeAll: 'readonly',
				afterAll: 'readonly',
				// Browser/DOM globals for tests
				window: 'readonly',
				document: 'readonly',
				global: 'readonly',
				HTMLElement: 'readonly',
				HTMLDivElement: 'readonly',
				HTMLImageElement: 'readonly',
				HTMLAnchorElement: 'readonly',
				Element: 'readonly',
				Event: 'readonly',
				MouseEvent: 'readonly',
				KeyboardEvent: 'readonly',
				WheelEvent: 'readonly',
				PointerEvent: 'readonly',
				UIEvent: 'readonly',
				Window: 'readonly',
				setTimeout: 'readonly',
				setImmediate: 'readonly'
			}
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-function-type': 'off',
			'@typescript-eslint/no-unused-vars': 'off'
		}
	},

	// Svelte files
	...eslintPluginSvelte.configs['flat/recommended'],
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsparser,
				sourceType: 'module',
				ecmaVersion: 2020
			},
			globals: {
				// Browser globals for Svelte components
				window: 'readonly',
				document: 'readonly',
				navigator: 'readonly',
				console: 'readonly',
				HTMLElement: 'readonly',
				HTMLImageElement: 'readonly',
				HTMLAnchorElement: 'readonly',
				Element: 'readonly',
				Event: 'readonly',
				MouseEvent: 'readonly',
				KeyboardEvent: 'readonly',
				WheelEvent: 'readonly',
				PointerEvent: 'readonly',
				UIEvent: 'readonly',
				setTimeout: 'readonly',
				clearTimeout: 'readonly',
				setInterval: 'readonly',
				clearInterval: 'readonly'
			}
		},
		rules: {
			'svelte/no-at-html-tags': 'off',
			'svelte/require-each-key': 'off',
			'svelte/no-navigation-without-resolve': 'off',
			'no-unused-vars': 'off'
		}
	},

	// Svelte TypeScript files (*.svelte.ts) - Svelte 5 runes
	{
		files: ['**/*.svelte.ts'],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 2020
			},
			globals: {
				// Svelte 5 runes
				$state: 'readonly',
				$derived: 'readonly',
				$effect: 'readonly',
				$props: 'readonly',
				$bindable: 'readonly',
				$inspect: 'readonly'
			}
		},
		plugins: {
			'@typescript-eslint': tseslint
		},
		rules: {
			...tseslint.configs.recommended.rules
		}
	},

	// JavaScript files
	{
		files: ['**/*.js', '**/*.mjs'],
		languageOptions: {
			sourceType: 'module',
			ecmaVersion: 2020,
			globals: {
				window: 'readonly',
				document: 'readonly',
				navigator: 'readonly',
				console: 'readonly',
				process: 'readonly',
				__dirname: 'readonly',
				__filename: 'readonly',
				module: 'readonly',
				require: 'readonly'
			}
		}
	},

	// Prettier config (must be last to override)
	prettier
];
