import '@analogjs/vite-plugin-angular/setup-vitest';
import '@testing-library/jest-dom/vitest';

import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import type { AxeResults } from 'axe-core';

getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

// A real browser provides a native ResizeObserver, so no jsdom mock is needed here.

// Under real-browser testing, CSS entrance/exit transitions (e.g. the sonner toast opacity fade)
// run for real. Assertions made right after an interaction would otherwise race the animation
// frames and see a still-transparent element. Collapse all transitions/animations to instant so
// component state is observable synchronously - this mirrors a `prefers-reduced-motion` user.
const disableAnimations = document.createElement('style');
disableAnimations.textContent = '*, *::before, *::after { transition: none !important; animation: none !important; }';
document.head.appendChild(disableAnimations);

// Accessibility matcher backed by axe-core (run via `src/testing/axe.ts`). vitest-axe ships its own
// matcher but its `axe` runner relies on Node's `module.createRequire`, which does not exist in the
// browser; this self-contained matcher keeps the `expect(await axe(el)).toHaveNoViolations()` API.
expect.extend({
	toHaveNoViolations(results: AxeResults) {
		const violations = results?.violations ?? [];
		const pass = violations.length === 0;
		return {
			pass,
			message: () =>
				pass
					? 'expected accessibility violations, but found none'
					: `expected no accessibility violations, but found ${violations.length}:\n` +
						violations.map((v) => `  [${v.id}] ${v.help} (${v.nodes.length} node(s))\n    ${v.helpUrl}`).join('\n'),
		};
	},
});
