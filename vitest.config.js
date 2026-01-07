import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig(({ mode }) => ({
	plugins: [
		svelte({ hot: !process.env.VITEST }),
		{
			name: 'virtual-modules',
			resolveId(id) {
				if (id === '$app/navigation') return 'virtual:$app/navigation';
			},
			load(id) {
				if (id === 'virtual:$app/navigation') return 'export default []'; // Provide your mock implementation here
			}
		}
	],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.js'],
		alias: {
			'$app/environment': path.resolve('./src/mocks/environment.ts')
		},
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'json', 'json-summary'],
			exclude: [
				'node_modules/',
				'src/mocks/',
				'src/tools/',
				'**/*.spec.ts',
				'**/*.test.ts',
				'vitest.config.js',
				'vite.config.js',
				'svelte.config.js'
			],
			thresholds: {
				lines: 50,
				functions: 50,
				branches: 50,
				statements: 50
			}
		}
	},
	resolve: {
		alias: {
			$lib: path.resolve(__dirname, './src/lib')
		},
		conditions: mode === 'test' ? ['browser'] : []
	}
}));
