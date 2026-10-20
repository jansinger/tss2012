import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig(({ mode }) => ({
	plugins: [
		sveltekit({
			preprocess: vitePreprocess(),
			adapter: adapter({ strict: true })
		})
	],
	build: {
		chunkSizeWarningLimit: 1000,
		rolldownOptions: {
			external: mode === 'production' ? ['web-worker'] : [],
			output: {
				// SvelteKit 3 configures `codeSplitting` for the client build, which makes
				// Rolldown ignore `manualChunks`. Groups are merged with SvelteKit's own.
				codeSplitting: {
					groups: [{ name: 'openlayers', test: /node_modules[\\/](?:.*[\\/])?ol[\\/]/ }]
				}
			}
		}
	},
	resolve: {
		// Include 'browser' condition in all non-production modes (dev, test, preview).
		// This makes Vite use the package's declared browser export for packages like
		// web-worker — no alias path-hacking needed, and it works in any directory context
		// (main repo, git worktrees, CI).
		// In production the option is left unset so Vite keeps its per-environment defaults —
		// SvelteKit 3 relies on the 'browser' condition to resolve its client runtime.
		conditions: mode !== 'production' ? ['browser'] : undefined
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
