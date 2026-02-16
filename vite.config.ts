import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';

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
			// web-worker has both Node and browser exports; ensure Vite always uses browser version
			// Node version imports 'url' and 'process' which are unavailable in the browser
			...(mode !== 'production' && {
				'web-worker': resolve(__dirname, 'node_modules/web-worker/src/browser/index.js')
			})
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
