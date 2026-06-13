/// <reference types="vitest" />

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	root: __dirname,
	plugins: [nxViteTsPaths()],
	test: {
		passWithNoTests: true,
		globals: true,
		environment: 'node',
		include: ['src/**/*.spec.ts'],
	},
	cacheDir: '../../node_modules/.vitest/registry',
});
