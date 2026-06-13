/// <reference types="vitest" />

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	root: __dirname,
	// `nxViteTsPaths` resolves the `@spartan-ng/*` workspace aliases (tsconfig.base paths) to source.
	plugins: [nxViteTsPaths()],
	test: {
		globals: true,
		environment: 'node',
		include: ['src/**/*.spec.ts'],
		// These specs run the real nx application/library generators against an in-memory tree, which
		// is heavy; give them headroom beyond the 5s default.
		testTimeout: 30_000,
	},
	cacheDir: '../../node_modules/.vitest/cli',
});
