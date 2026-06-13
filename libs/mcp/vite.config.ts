/// <reference types="vitest" />

import { defineConfig } from 'vite';

// Source files use ESM-style `.js` import specifiers (NodeNext). Vite does not resolve a `.js`
// specifier to its `.ts` source on its own, so strip the extension for relative imports (the
// previous jest config did the same via `moduleNameMapper`).
const resolveTsFromJsSpecifier = {
	name: 'resolve-ts-from-js-specifier',
	enforce: 'pre' as const,
	resolveId(source: string, importer: string | undefined) {
		if (importer && /^\.{1,2}\//.test(source) && source.endsWith('.js')) {
			return this.resolve(source.slice(0, -3), importer, { skipSelf: true });
		}
		return null;
	},
};

// https://vitejs.dev/config/
export default defineConfig({
	// Pin the Vite root to this project so the @nx/vitest executor (which runs from the workspace
	// root) discovers the `src/**/*.spec.ts` files instead of resolving them against the workspace.
	root: __dirname,
	plugins: [resolveTsFromJsSpecifier],
	test: {
		globals: true,
		// Emit the default summary so CI logs show the test counts; a terse reporter previously let
		// a project's specs go silently undiscovered.
		reporters: ['default'],
		environment: 'node',
		include: ['src/**/*.spec.ts'],
	},
	cacheDir: '../../node_modules/.vitest/mcp',
});
