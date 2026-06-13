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
		setupFiles: ['src/test-setup.ts'],
		include: ['src/**/*.spec.ts'],
		// The doc/snippet generators under test log progress chatter ("Missing style file", "Snippets
		// generated", ...). The specs assert on generated output, not this logging, so drop it to keep
		// the CI log readable; failures are still reported by the test reporter.
		onConsoleLog: () => false,
	},
	cacheDir: '../../node_modules/.vitest/tools',
});
