/// <reference types="vitest" />

import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const root = fileURLToPath(new URL('./src', import.meta.url));
const cacheDir = fileURLToPath(new URL('../../node_modules/.vitest/libs-trpc', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	return {
		root,
		cacheDir,
		test: {
			passWithNoTests: true,
			globals: true,
			environment: 'jsdom',
			setupFiles: ['test-setup.ts'],
			include: ['**/*.spec.ts'],
		},
		define: {
			'import.meta.vitest': mode !== 'production',
		},
	};
});
