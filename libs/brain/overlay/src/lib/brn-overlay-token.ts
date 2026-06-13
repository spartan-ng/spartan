import { inject, InjectionToken, type ValueProvider } from '@angular/core';
import type { BrnOverlayOptions } from './brn-overlay-options';

export type BrnOverlayDefaultOptions = Omit<BrnOverlayOptions, 'direction' | 'id' | 'providers'>;

const createDefaultOptions = (): BrnOverlayDefaultOptions => ({
	attachPositions: [],
	attachTo: null,
	backdropClass: '',
	closeOnBackdropClick: true,
	closeOnOutsidePointerEvents: false,
	disableClose: false,
	hasBackdrop: false,
	panelClass: '',
	positionStrategy: null,
	role: null,
	scrollStrategy: null,
});

const cloneDefaultOptions = (options: BrnOverlayDefaultOptions): BrnOverlayDefaultOptions => ({
	...options,
	attachPositions: [...options.attachPositions],
});

export const defaultOptions: BrnOverlayDefaultOptions = createDefaultOptions();

export const BRN_OVERLAY_DEFAULT_OPTIONS = new InjectionToken<BrnOverlayDefaultOptions>('brn-overlay-default-options', {
	providedIn: 'root',
	factory: createDefaultOptions,
});

export function provideBrnOverlayDefaultOptions(options: Partial<BrnOverlayDefaultOptions>): ValueProvider {
	return {
		provide: BRN_OVERLAY_DEFAULT_OPTIONS,
		useValue: cloneDefaultOptions({ ...createDefaultOptions(), ...options }),
	};
}

export function injectBrnOverlayDefaultOptions(): BrnOverlayDefaultOptions {
	return cloneDefaultOptions(inject(BRN_OVERLAY_DEFAULT_OPTIONS, { optional: true }) ?? defaultOptions);
}

export const BRN_OVERLAY_DATA = new InjectionToken<unknown>('brn-overlay-data');

export function injectBrnOverlayContext<OverlayContext = unknown>() {
	return inject(BRN_OVERLAY_DATA) as OverlayContext;
}
