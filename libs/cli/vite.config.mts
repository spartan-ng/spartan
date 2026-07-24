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
		// Emit the default summary so CI logs show the test counts; a terse reporter previously let
		// a project's specs go silently undiscovered.
		reporters: ['default'],
		environment: 'node',
		include: ['src/**/*.spec.ts'],
		// These specs run the real nx application/library generators against an in-memory tree, which
		// is heavy; give them headroom beyond the 5s default.
		testTimeout: 30_000,
		// The nx generators under test log copiously to stdout/stderr ("Couldn't find .gitignore",
		// "NX workspace root does not exist", etc.). Across 142 specs that floods (and truncates) the
		// CI log and buries the run summary. The specs assert on the tree and on console spies, not on
		// this output, so drop it - failures are still reported by the test reporter.
		onConsoleLog: () => false,
	},
	cacheDir: '../../node_modules/.vitest/cli',
});
