import { inject, InjectionToken, ValueProvider } from '@angular/core';
import { BrnDialogOptions } from './brn-dialog-options';

export interface BrnDialogDefaultOptions {
	/** A connected position as specified by the user. */
	attachPositions: BrnDialogOptions['attachPositions'];

	/** Options for where to set focus to automatically on dialog open */
	autoFocus: BrnDialogOptions['autoFocus'];

	/** The delay in milliseconds before the dialog closes. */
	closeDelay: number;

	/** Close dialog on backdrop click */
	closeOnBackdropClick: boolean;

	/** Close dialog on outside pointer event */
	closeOnOutsidePointerEvents: boolean;

	/** Whether the dialog closes with the escape key or pointer events outside the panel element. */
	disableClose: boolean;

	/** Whether the dialog has a backdrop. */
	hasBackdrop: boolean;

	/** Strategy to use when positioning the dialog */
	positionStrategy: BrnDialogOptions['positionStrategy'];

	/** Whether the dialog should restore focus to the previously-focused element upon closing. */
	restoreFocus: BrnDialogOptions['restoreFocus'];

	/** The role of the dialog */
	role: BrnDialogOptions['role'];

	/** Scroll strategy to be used for the dialog. */
	scrollStrategy: BrnDialogOptions['scrollStrategy'] | 'close' | 'reposition';
}

export const defaultOptions: BrnDialogDefaultOptions = {
	attachPositions: [],
	autoFocus: 'first-tabbable',
	closeDelay: 100,
	closeOnBackdropClick: true,
	closeOnOutsidePointerEvents: false,
	disableClose: false,
	hasBackdrop: true,
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
