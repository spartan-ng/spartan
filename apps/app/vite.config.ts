/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import { type Plugin, defineConfig, splitVendorChunkPlugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { getPrerenderedRoutes } from './src/utils/prerender-routes';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	// In dev the Analog Nitro server builds its public-asset manifest from `output.publicDir`
	// (default: dist/<app>/analog/public), which `nx serve` never populates - the docs JSON is
	// generated into src/public (Vite's publicDir) instead. Point Nitro at the same source dir so a
	// server-side $fetch('/data/..') from our page loaders resolves without a prior production build.
	const isServe = command === 'serve';

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
				'@ng-icons/remixicon',
				'luxon',
				'@angular/cdk/portal',
				'@angular/cdk/observers',
				'@angular/cdk/listbox',
				'@angular/cdk/collections',
				'embla-carousel-autoplay',
				'embla-carousel-angular',
			],
		},
		ssr: {
			noExternal: [
				'@spartan-ng/**',
				'@angular/cdk/**',
				'@ng-icons/**',
				'ngx-scrollbar/**',
				'ngx-echarts',
				'@analogjs/trpc',
				'@trpc/server',
			],
		},
		build: {
			outDir: '../../dist/apps/app/client',
			// Skip computing gzip sizes for every chunk - it is only an informational report.
			reportCompressedSize: false,
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
							'/colors',

							'/documentation/introduction',
							'/documentation/changelog',
							'/documentation/about',

							'/documentation/installation',
							'/documentation/components-json',
							'/documentation/theming',
							'/documentation/dark-mode',
							'/documentation/cli',
							'/documentation/typography',
							'/documentation/figma',
							'/documentation/version-support',
							'/documentation/health-checks',
							'/documentation/update-guide',
							'/documentation/mcp',
							'/documentation/skills',
							'/documentation/rtl',
							'/documentation/styles',

							'/blocks/sidebar',
							'/blocks/calendar',
							'/blocks/login',
							'/blocks/signup',
							'/blocks/stepper',

							'/forms',
							'/forms/reactive-forms',
							'/forms/signal-forms',

							'/stack/overview',
							'/stack/technologies',
							'/stack/installation',
						];

						return await getPrerenderedRoutes(staticRoutes);
					},
					sitemap: {
						host: 'https://www.spartan.ng',
					},
				},
				nitro: {
					logLevel: 4,
					...(isServe ? { output: { publicDir: path.resolve(__dirname, 'src/public') } } : {}),
					prerender: {
						concurrency: 1,
					},
					serverAssets: [
						{
							baseName: 'data',
							dir: './src/public/data',
						},
					],
					rollupConfig: {
						plugins: [],
					},
				},
			}),
			nxViteTsPaths(),
			splitVendorChunkPlugin(),
			// Bundle analysis is opt-in (ANALYZE=1) so it does not traverse the whole bundle on
			// every production build.
			...(process.env.ANALYZE ? [visualizer() as Plugin] : []),
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
			// Run the suite in a single forked process. The AppComponent smoke test boots the full app
			// shell, and the Analog/vite-plugin-angular transform of that deep import graph is heavy;
			// spawning a worker per core multiplied that footprint and intermittently OOM-crashed a
			// vitest worker in CI (exit 1, no output) when several nx projects tested in parallel. One
			// memory-bounded fork keeps the docs app's footprint predictable. The suite is tiny, so the
			// loss of intra-suite parallelism is negligible.
			pool: 'forks',
			poolOptions: {
				forks: {
					minForks: 1,
					maxForks: 1,
				},
			},
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
