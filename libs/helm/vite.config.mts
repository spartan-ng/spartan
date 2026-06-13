/// <reference types="vitest" />

import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	// Pin the Vite root to this project so the @nx/vitest executor (which runs from the workspace
	// root) still resolves project-relative paths and the browser server serves from here.
	root: __dirname,
	// `nxViteTsPaths` resolves the `@spartan-ng/*` workspace aliases (tsconfig.base paths) to source.
	plugins: [angular(), nxViteTsPaths()],
	// Browser mode serves modules over HTTP; allow reaching the workspace-root pnpm store.
	server: {
		fs: {
			allow: ['../..'],
		},
	},
	test: {
		globals: true,
		setupFiles: ['src/test-setup.ts'],
		include: ['**/*.spec.ts'],
		reporters: ['default'],
		// Real-browser testing via Playwright/Chromium - jsdom cannot faithfully exercise layout,
		// focus, pointer events or computed styles that these component specs rely on.
		browser: {
			enabled: true,
			headless: true,
			provider: 'playwright',
			name: 'chromium',
		},
	},
	define: {
		'import.meta.vitest': mode !== 'production',
	},
	cacheDir: '../../node_modules/.vitest/helm',
}));
