import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

export default defineConfig({
  plugins: [
    svelte({ hot: !process.env.VITEST }),
    {
      name: 'virtual-modules',
      resolveId(id) {
        if (id === '$app/navigation')
          return 'virtual:$app/navigation';
        if (id === '$app/environment')
          return 'virtual:$app/environment';

      }
    }
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.js']
  },
  resolve: {
    alias: {
      $lib: path.resolve(__dirname, './src/lib')
    },
  },
})