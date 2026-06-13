import { inject, InjectionToken, type ValueProvider } from '@angular/core';
import type { BrnOverlayOptions } from './brn-overlay-options';

export interface BrnOverlayDefaultOptions {
	ariaLabel: BrnOverlayOptions['ariaLabel'];
	ariaModal: BrnOverlayOptions['ariaModal'];
	attachPositions: BrnOverlayOptions['attachPositions'];
	attachTo: BrnOverlayOptions['attachTo'];
	autoFocus: BrnOverlayOptions['autoFocus'];
	backdropClass: BrnOverlayOptions['backdropClass'];
	closeOnBackdropClick: BrnOverlayOptions['closeOnBackdropClick'];
	closeOnOutsidePointerEvents: BrnOverlayOptions['closeOnOutsidePointerEvents'];
	disableClose: BrnOverlayOptions['disableClose'];
	hasBackdrop: BrnOverlayOptions['hasBackdrop'];
	panelClass: BrnOverlayOptions['panelClass'];
	positionStrategy: BrnOverlayOptions['positionStrategy'];
	restoreFocus: BrnOverlayOptions['restoreFocus'];
	role: BrnOverlayOptions['role'];
	scrollStrategy: BrnOverlayOptions['scrollStrategy'] | 'close' | 'reposition';
	trapFocus: BrnOverlayOptions['trapFocus'];
}

export const defaultOptions: BrnOverlayDefaultOptions = {
	ariaLabel: undefined,
	ariaModal: false,
	attachPositions: [],
	attachTo: null,
	autoFocus: false,
	backdropClass: '',
	closeOnBackdropClick: true,
	closeOnOutsidePointerEvents: false,
	disableClose: false,
	hasBackdrop: false,
	panelClass: '',
	positionStrategy: null,
	restoreFocus: true,
	role: null,
	scrollStrategy: null,
	trapFocus: false,
};

export const BRN_OVERLAY_DEFAULT_OPTIONS = new InjectionToken<BrnOverlayDefaultOptions>('brn-overlay-default-options', {
	providedIn: 'root',
	factory: () => defaultOptions,
});

export function provideBrnOverlayDefaultOptions(options: Partial<BrnOverlayDefaultOptions>): ValueProvider {
	return { provide: BRN_OVERLAY_DEFAULT_OPTIONS, useValue: { ...defaultOptions, ...options } };
}

export function injectBrnOverlayDefaultOptions(): BrnOverlayDefaultOptions {
	return inject(BRN_OVERLAY_DEFAULT_OPTIONS, { optional: true }) ?? defaultOptions;
}

export const BRN_OVERLAY_DATA = new InjectionToken<unknown>('brn-overlay-data');

export function injectBrnOverlayContext<OverlayContext = unknown>() {
	return inject(BRN_OVERLAY_DATA) as OverlayContext;
}
