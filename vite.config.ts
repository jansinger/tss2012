import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit()],
	build: {
		chunkSizeWarningLimit: 1000,
		rollupOptions: {
			external: mode === 'production' ? ['web-worker'] : [],
			output: {
				manualChunks: (id) => {
					const normalizedId = id.replace(/\\/g, '/');
					if (/(?:^|\/)node_modules(?:\/.*)?\/ol\//.test(normalizedId)) return 'openlayers';
				}
			}
		}
	},
	resolve: {
		// Include 'browser' condition in all non-production modes (dev, test, preview).
		// This makes Vite use the package's declared browser export for packages like
		// web-worker — no alias path-hacking needed, and it works in any directory context
		// (main repo, git worktrees, CI).
		conditions: mode !== 'production' ? ['browser'] : []
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
