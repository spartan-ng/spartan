import axeCore, { type AxeResults, type ElementContext, type RunOptions } from 'axe-core';

/**
 * Run axe-core accessibility checks against a DOM node. axe-core is a browser-native library, so
 * under Vitest browser mode it runs directly against the real rendered DOM - no jsdom shim. Pair
 * with the `toHaveNoViolations` matcher registered in `src/test-setup.ts`.
 */
export function axe(context?: ElementContext, options?: RunOptions): Promise<AxeResults> {
	return axeCore.run(context ?? document, options ?? {});
}

declare module 'vitest' {
	interface Assertion<T = unknown> {
		toHaveNoViolations(): T;
	}
	interface AsymmetricMatchersContaining {
		toHaveNoViolations(): void;
	}
}
