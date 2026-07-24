import { inject, InjectionToken, type ValueProvider } from '@angular/core';
import type { BrnDialogOptions } from './brn-dialog-options';

export type BrnDialogDefaultOptions = Omit<BrnDialogOptions, 'direction' | 'id' | 'providers'>;

export const defaultOptions: BrnDialogDefaultOptions = {
	ariaDescribedBy: undefined,
	ariaLabel: undefined,
	ariaLabelledBy: undefined,
	ariaModal: true,
	attachPositions: [],
	attachTo: null,
	autoFocus: 'first-tabbable',
	backdropClass: '',
	closeOnOutsidePointerEvents: false,
	disableClose: false,
	hasBackdrop: true,
	panelClass: '',
	positionStrategy: null,
	restoreFocus: true,
	role: 'dialog',
	scrollStrategy: null,
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
