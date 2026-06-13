/// <reference types="vitest" />

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	root: __dirname,
	// `nxViteTsPaths` resolves the `@spartan-ng/*` workspace aliases (tsconfig.base paths) to source.
	plugins: [nxViteTsPaths()],
	test: {
		passWithNoTests: true,
		globals: true,
		environment: 'node',
		setupFiles: ['src/test-setup.ts'],
		include: ['src/**/*.spec.ts'],
	},
	cacheDir: '../../node_modules/.vitest/tools',
});
