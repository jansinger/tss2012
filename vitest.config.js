import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
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
		}
	},
	resolve: {
		alias: {
			$lib: path.resolve(__dirname, './src/lib')
		}
	}
});
