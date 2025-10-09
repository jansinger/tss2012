/// <reference types="vitest" />

// Configure Vitest (https://vitest.dev/config/)

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
	// Suppress warnings for Node.js-only libraries used during SSR/prerender
	optimizeDeps: {
		exclude: []
	},
	ssr: {
		noExternal: mode === 'production' ? [] : undefined
	}
}));
