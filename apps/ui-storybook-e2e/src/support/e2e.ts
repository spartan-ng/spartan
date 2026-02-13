// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import '@testing-library/cypress/add-commands';
import 'cypress-axe';
import 'cypress-real-events';
import './commands';

// Patch Pointer Capture for Cypress-run tests.
// NOTE: This is a test-only shim. It makes pointer capture behave predictably for synthetic events.
Cypress.on('window:before:load', (win) => {
	const capturedByEl = new WeakMap<Element, Set<number>>();

	const nativeSet = win.Element.prototype.setPointerCapture;
	const nativeHas = win.Element.prototype.hasPointerCapture;
	const nativeRelease = win.Element.prototype.releasePointerCapture;

	win.Element.prototype.setPointerCapture = function (pointerId: number) {
		let set = capturedByEl.get(this);
		if (!set) {
			set = new Set<number>();
			capturedByEl.set(this, set);
		}
		set.add(pointerId);

		// Best effort: still call native if it works in this environment
		try {
			return nativeSet?.call(this, pointerId);
		} catch {
			return;
		}
	};

	win.Element.prototype.hasPointerCapture = function (pointerId: number) {
		const set = capturedByEl.get(this);
		if (set?.has(pointerId)) return true;

		try {
			return nativeHas?.call(this, pointerId) ?? false;
		} catch {
			return false;
		}
	};

	win.Element.prototype.releasePointerCapture = function (pointerId: number) {
		capturedByEl.get(this)?.delete(pointerId);

		try {
			return nativeRelease?.call(this, pointerId);
		} catch {
			return;
		}
	};
});
