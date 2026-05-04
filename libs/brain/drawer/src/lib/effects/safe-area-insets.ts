import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';

/**
 * Reads safe-area inset values from CSS environment variables.
 * Uses a temporary hidden element to avoid layout thrash on `:root`.
 * Must be called in injection context.
 */
export function getSafeAreaInsets(): {
	top: number;
	left: number;
	right: number;
	bottom: number;
} {
	const doc = inject(DOCUMENT);
	const win = doc.defaultView;
	const zero = { top: 0, left: 0, right: 0, bottom: 0 };

	// SSR: Angular's server `DOCUMENT` (Domino) has no `defaultView`, so the
	// global `getComputedStyle` is undefined — and even with a polyfill the
	// server can't resolve `env(safe-area-inset-*)` so the result would
	// collapse to zero anyway. Skip the probe.
	if (!doc.body || !win) {
		return zero;
	}

	const div = doc.createElement('div');
	div.style.position = 'fixed';
	div.style.left = '0';
	div.style.top = '0';
	div.style.width = '0';
	div.style.height = '0';
	div.style.visibility = 'hidden';
	div.style.paddingTop = 'env(safe-area-inset-top)';
	div.style.paddingLeft = 'env(safe-area-inset-left)';
	div.style.paddingRight = 'env(safe-area-inset-right)';
	div.style.paddingBottom = 'env(safe-area-inset-bottom)';
	doc.body.appendChild(div);

	// Use `win.getComputedStyle` rather than the global so the call resolves
	// through the same `Window` we just guarded — keeps the dependency
	// explicit and matches the `doc.defaultView` pattern used by the other
	// trackers in this directory (`trackDimensions`, `trackVirtualKeyboard`).
	const computed = win.getComputedStyle(div);
	const result = {
		top: parseFloat(computed.paddingTop) || 0,
		left: parseFloat(computed.paddingLeft) || 0,
		right: parseFloat(computed.paddingRight) || 0,
		bottom: parseFloat(computed.paddingBottom) || 0,
	};

	doc.body.removeChild(div);
	return result;
}
