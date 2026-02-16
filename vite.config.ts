import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit()],
	build: {
		chunkSizeWarningLimit: 1000,
		rollupOptions: {
			external: mode === 'production' ? ['web-worker'] : []
		}
	},
	resolve: {
		conditions: mode === 'test' ? ['browser'] : [],
		alias: {
			// Prevent Node.js modules from being bundled in browser code
			'web-worker': mode === 'production' ? false : 'web-worker'
		}
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler' // or "modern"
			}
		}
	},
	ssr: {
		noExternal: mode === 'production' ? [] : undefined
	}
}));
