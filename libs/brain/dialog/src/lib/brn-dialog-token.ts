import { inject, InjectionToken, type ValueProvider } from '@angular/core';
import type { BrnDialogOptions } from './brn-dialog-options';

export interface BrnDialogDefaultOptions {
	/** Aria label to assign to the dialog element. */
	ariaLabel: BrnDialogOptions['ariaLabel'];

	/** Whether the dialog should be considered a modal dialog. */
	ariaModal: BrnDialogOptions['ariaModal'];

	/** A connected position as specified by the user. */
	attachPositions: BrnDialogOptions['attachPositions'];

	/** Element to which the dialog should be attached. */
	attachTo: BrnDialogOptions['attachTo'];

	/** Options for where to set focus to automatically on dialog open */
	autoFocus: BrnDialogOptions['autoFocus'];

	/** CSS class to be applied to the backdrop. */
	backdropClass: BrnDialogOptions['backdropClass'];

	/** The delay in milliseconds before the dialog closes. */
	closeDelay: BrnDialogOptions['closeDelay'];

	/** Close dialog on backdrop click */
	closeOnBackdropClick: BrnDialogOptions['closeOnBackdropClick'];

	/** Close dialog on outside pointer event */
	closeOnOutsidePointerEvents: BrnDialogOptions['closeOnOutsidePointerEvents'];

	/** Whether the dialog closes with the escape key or pointer events outside the panel element. */
	disableClose: BrnDialogOptions['disableClose'];

	/** Whether the dialog has a backdrop. */
	hasBackdrop: BrnDialogOptions['hasBackdrop'];

	/** CSS class applied to the panel. */
	panelClass: BrnDialogOptions['panelClass'];

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
	ariaLabel: undefined,
	ariaModal: true,
	attachPositions: [],
	attachTo: null,
	autoFocus: 'first-tabbable',
	backdropClass: 'bg-transparent',
	closeDelay: 100,
	closeOnBackdropClick: true,
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
