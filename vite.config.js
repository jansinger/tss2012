/// <reference types="vitest" />

// Configure Vitest (https://vitest.dev/config/)

import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit()],
	build: {
		chunkSizeWarningLimit: 1000
	},
	resolve: {
		conditions: mode === 'test' ? ['browser'] : [],
	},
	css: {
		preprocessorOptions: {
		  scss: {
			api: 'modern-compiler' // or "modern"
		  }
		}
	  }
}));