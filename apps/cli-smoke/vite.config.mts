/// <reference types="vitest" />

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	root: __dirname,
	plugins: [nxViteTsPaths()],
	test: {
		globals: true,
		environment: 'node',
		include: ['src/**/*.spec.ts'],
		// Stands up a local npm registry and publishes the spartan packages before the matrix runs.
		globalSetup: ['src/support/global-setup.ts'],
		// Each matrix cell scaffolds a workspace, installs dependencies and runs a real build, so the
		// suite is slow and must not run in parallel (a single local registry is shared).
		testTimeout: 900_000,
		hookTimeout: 900_000,
		fileParallelism: false,
		pool: 'forks',
		poolOptions: {
			forks: { singleFork: true },
		},
	},
	cacheDir: '../../node_modules/.vitest/cli-smoke',
});
