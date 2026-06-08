import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, signal, type Signal } from '@angular/core';

/**
 * Tracks the window dimensions and updates on resize.
 * Must be called in injection context.
 */
export function trackDimensions(): {
	windowHeight: Signal<number>;
	windowWidth: Signal<number>;
} {
	const doc = inject(DOCUMENT);
	const destroyRef = inject(DestroyRef);
	const win = doc.defaultView;

	const windowHeight = signal(win?.innerHeight ?? 0);
	const windowWidth = signal(win?.innerWidth ?? 0);

	if (win) {
		const handler = (): void => {
			windowHeight.set(win.innerHeight);
			windowWidth.set(win.innerWidth);
		};

		win.addEventListener('resize', handler);
		destroyRef.onDestroy(() => win.removeEventListener('resize', handler));
	}

	return {
		windowHeight: windowHeight.asReadonly(),
		windowWidth: windowWidth.asReadonly(),
	};
}
