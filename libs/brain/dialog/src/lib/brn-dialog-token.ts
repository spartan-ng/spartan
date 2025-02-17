import { inject, InjectionToken, ValueProvider } from '@angular/core';

export interface BrnDialogDefaultOptions {
	/** The delay in milliseconds before the dialog closes. */
	closeDelay?: number;
}

export const defaultOptions: BrnDialogDefaultOptions = {
	closeDelay: 0,
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
