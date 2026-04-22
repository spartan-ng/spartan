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
	const zero = { top: 0, left: 0, right: 0, bottom: 0 };

	if (!doc.body) {
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

	const computed = getComputedStyle(div);
	const result = {
		top: parseFloat(computed.paddingTop) || 0,
		left: parseFloat(computed.paddingLeft) || 0,
		right: parseFloat(computed.paddingRight) || 0,
		bottom: parseFloat(computed.paddingBottom) || 0,
	};

	doc.body.removeChild(div);
	return result;
}
