import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface BrnHoverCardDefaultOptions {
	showDelay: number;
	hideDelay: number;
	animationDelay: number;
	sideOffset: number;
	align: 'top' | 'bottom';
}

export const defaultOptions: BrnHoverCardDefaultOptions = {
	showDelay: 300,
	hideDelay: 500,
	animationDelay: 100,
	sideOffset: 5,
	align: 'bottom',
};

const BRN_HOVER_CARD_DEFAULT_OPTIONS = new InjectionToken<BrnHoverCardDefaultOptions>(
	'brn-hover-card-default-options',
	{
		providedIn: 'root',
		factory: () => defaultOptions,
	},
);

export function provideBrnHoverCardDefaultOptions(options: Partial<BrnHoverCardDefaultOptions>): ValueProvider {
	return { provide: BRN_HOVER_CARD_DEFAULT_OPTIONS, useValue: { ...defaultOptions, ...options } };
}

export function injectBrnHoverCardDefaultOptions(): BrnHoverCardDefaultOptions {
	return inject(BRN_HOVER_CARD_DEFAULT_OPTIONS, { optional: true }) ?? defaultOptions;
}
