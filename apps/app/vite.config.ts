/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import { type Plugin, defineConfig, splitVendorChunkPlugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	return {
		root: __dirname,
		publicDir: 'src/public',
		optimizeDeps: {
			include: ['@spartan-ng/trpc', '@angular/common', '@angular/forms', 'isomorphic-fetch'],
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
				prerender: {
					routes: [
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

						'/components/accordion',
						'/components/alert',
						'/components/alert-dialog',
						'/components/aspect-ratio',
						'/components/avatar',
						'/components/badge',
						'/components/breadcrumb',
						'/components/button',
						'/components/calendar',
						'/components/card',
						'/components/carousel',
						'/components/checkbox',
						'/components/collapsible',
						'/components/combobox',
						'/components/command',
						'/components/context-menu',
						'/components/data-table',
						'/components/dialog',
						'/components/dropdown-menu',
						'/components/form-field',
						'/components/hover-card',
						'/components/icon',
						'/components/input',
						'/components/label',
						'/components/menubar',
						'/components/pagination',
						'/components/popover',
						'/components/progress',
						'/components/radio-group',
						'/components/scroll-area',
						'/components/select',
						'/components/separator',
						'/components/sheet',
						'/components/skeleton',
						'/components/sonner',
						'/components/spinner',
						'/components/switch',
						'/components/table',
						'/components/tabs',
						'/components/textarea',
						'/components/toggle',
						'/components/tooltip',

						'/stack/overview',
						'/stack/technologies',
						'/stack/installation',

						'/examples/notes',
						'/examples/typography',
						'/examples/authentication',
						'/examples/music',
					],
					sitemap: {
						host: 'https://www.spartan.ng',
					},
				},
				nitro: {
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
