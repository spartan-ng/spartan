/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import { type Plugin, defineConfig, splitVendorChunkPlugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { getPrerenderedRoutes } from './src/utils/prerender-routes';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	return {
		root: __dirname,
		publicDir: 'src/public',
		optimizeDeps: {
			include: [
				'@angular/common',
				'@angular/forms',
				'isomorphic-fetch',
				'@trpc/**/*',
				'h3',
				'ufo',
				'marked',
				'marked-gfm-heading-id',
				'marked-highlight',
				'prismjs/**/*',
				'ngx-sonner',
				'@ng-icons/remixicon',
				'luxon',
				'@angular/cdk/portal',
				'@angular/cdk/observers',
				'@angular/cdk/listbox',
				'@angular/cdk/collections',
				'embla-carousel-autoplay',
				'embla-carousel-angular',
				'ng-signal-forms',
			],
		},
		ssr: {
			noExternal: [
				'@spartan-ng/**',
				'@angular/cdk/**',
				'@ng-icons/**',
				'ngx-scrollbar/**',
				'ng-signal-forms/**',
				'@analogjs/trpc',
				'@trpc/server',
			],
		},
		build: {
			outDir: '../../dist/apps/app/client',
			reportCompressedSize: true,
			commonjsOptions: { transformMixedEsModules: true },
			target: ['es2020'],
		},
		resolve: {
			alias: {
				'~': path.resolve(__dirname, './src'),
			},
		},
		plugins: [
			tsconfigPaths(),
			{
				name: 'custom-url-and-date-replacer', // replaced @rollup/plugin-replace given compatability issues with latest vite
				transform(code, id) {
					try {
						if (id.endsWith('.js') || id.endsWith('.html')) {
							const transformedCode = code
								.replace(/http:\/\/127\.0\.0\.1:4200/g, 'https://www.spartan.ng')
								.replace(/__LASTMOD__/g, JSON.stringify(new Date().toISOString()));
							return {
								code: transformedCode,
								map: null,
							};
						}
					} catch (error) {
						console.error('Error in custom-url-and-date-replacer:', error);
						// Optionally rethrow or handle the error further
						throw error;
					}
					return null; // No transformation applied
				},
			},
			analog({
				content: {
					highlighter: 'prism',
				},
				prerender: {
					routes: async () => {
						const staticRoutes = [
							'/',

							'/documentation/dark-mode',
							'/documentation/figma',
							'/documentation/health-checks',
							'/documentation/installation',
							'/documentation/theming',
							'/documentation/typography',

							'/documentation/about',
							'/documentation/changelog',
							'/documentation/cli',
							'/documentation/components-json',
							'/documentation/introduction',

							'/stack/overview',
							'/stack/technologies',
							'/stack/installation',

							'/examples/notes',
							'/examples/typography',
							'/examples/authentication',
							'/examples/music',
						];

						return await getPrerenderedRoutes(staticRoutes);
					},
					sitemap: {
						host: 'https://www.spartan.ng',
					},
				},
				nitro: {
					logLevel: 4,
					rollupConfig: {
						plugins: [],
					},
				},
			}),
			nxViteTsPaths(),
			visualizer() as Plugin,
			splitVendorChunkPlugin(),
		],
		test: {
			reporters: ['default'],
			coverage: {
				reportsDirectory: '../../coverage/apps/app',
				provider: 'v8',
			},
			globals: true,
			environment: 'jsdom',
			setupFiles: ['src/test-setup.ts'],
			include: ['**/*.spec.ts'],
			cache: {
				dir: '../../node_modules/.vitest',
			},
		},
		define: {
			'import.meta.vitest': mode !== 'production',
		},
		server: {
			fs: {
				allow: ['../..'],
			},
		},
	};
});
