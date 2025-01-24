/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig, splitVendorChunkPlugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	return {
		root: __dirname,
		cacheDir: `../../node_modules/.vite`,

		ssr: {
			noExternal: ['@analogjs/trpc', '@trpc/server'],
		},

		build: {
			outDir: '../../dist/apps/spartan-installation/client',
			reportCompressedSize: true,
			target: ['es2020'],
		},
		server: {
			fs: {
				allow: ['.'],
			},
		},
		plugins: [
			analog({
				nitro: {
					routeRules: {
						'/': {
							prerender: false,
						},
					},
				},
			}),

			nxViteTsPaths(),
			splitVendorChunkPlugin(),
		],
		test: {
			globals: true,
			environment: 'jsdom',
			setupFiles: ['src/test-setup.ts'],
			include: ['**/*.spec.ts'],
			reporters: ['default'],
		},
		define: {
			'import.meta.vitest': mode !== 'production',
		},
	};
});
