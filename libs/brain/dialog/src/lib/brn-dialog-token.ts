import { inject, InjectionToken, type ValueProvider } from '@angular/core';
import { type BrnOverlayDefaultOptions, defaultOptions as overlayDefaultOptions } from '@spartan-ng/brain/overlay';

export type BrnDialogDefaultOptions = BrnOverlayDefaultOptions;

export const defaultOptions: BrnDialogDefaultOptions = {
	...overlayDefaultOptions,
	ariaModal: true,
	autoFocus: 'first-tabbable',
	hasBackdrop: true,
	role: 'dialog',
	trapFocus: true,
};

const BRN_DIALOG_DEFAULT_OPTIONS = new InjectionToken<BrnDialogDefaultOptions>('brn-dialog-default-options', {
	providedIn: 'root',
	factory: () => defaultOptions,
});

export function provideBrnDialogDefaultOptions(options: Partial<BrnDialogDefaultOptions>): ValueProvider {
	return { provide: BRN_DIALOG_DEFAULT_OPTIONS, useValue: { ...defaultOptions, ...options } };
}

export function injectBrnDialogDefaultOptions(): BrnDialogDefaultOptions {
	return inject(BRN_DIALOG_DEFAULT_OPTIONS, { optional: true }) ?? defaultOptions;
}
