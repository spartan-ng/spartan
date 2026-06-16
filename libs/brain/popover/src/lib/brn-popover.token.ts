import { inject, InjectionToken, type ValueProvider } from '@angular/core';
import { type BrnOverlayDefaultOptions, defaultOptions as overlayDefaultOptions } from '@spartan-ng/brain/overlay';

export type BrnPopoverAlign = 'start' | 'center' | 'end';

export interface BrnPopoverConfig {
	align: BrnPopoverAlign;
	sideOffset: number;
	offsetX: number;
}

const defaultConfig: BrnPopoverConfig = {
	align: 'center',
	sideOffset: 0,
	offsetX: 0,
};

const BrnPopoverConfigToken = new InjectionToken<BrnPopoverConfig>('BrnPopoverConfig');

export function provideBrnPopoverConfig(config: Partial<BrnPopoverConfig>): ValueProvider {
	return { provide: BrnPopoverConfigToken, useValue: { ...defaultConfig, ...config } };
}

export function injectBrnPopoverConfig(): BrnPopoverConfig {
	return inject(BrnPopoverConfigToken, { optional: true }) ?? defaultConfig;
}

export const BRN_POPOVER_OVERLAY_DEFAULT_OPTIONS: BrnOverlayDefaultOptions = {
	...overlayDefaultOptions,
	autoFocus: true,
	closeOnOutsidePointerEvents: true,
	hasBackdrop: false,
	role: 'dialog',
	scrollStrategy: 'reposition',
};

const BRN_POPOVER_DEFAULT_OPTIONS = new InjectionToken<BrnOverlayDefaultOptions>('brn-popover-default-options', {
	providedIn: 'root',
	factory: () => BRN_POPOVER_OVERLAY_DEFAULT_OPTIONS,
});

export function provideBrnPopoverDefaultOptions(options: Partial<BrnOverlayDefaultOptions>): ValueProvider {
	return {
		provide: BRN_POPOVER_DEFAULT_OPTIONS,
		useValue: { ...BRN_POPOVER_OVERLAY_DEFAULT_OPTIONS, ...options },
	};
}

export function injectBrnPopoverDefaultOptions(): BrnOverlayDefaultOptions {
	return inject(BRN_POPOVER_DEFAULT_OPTIONS, { optional: true }) ?? BRN_POPOVER_OVERLAY_DEFAULT_OPTIONS;
}
