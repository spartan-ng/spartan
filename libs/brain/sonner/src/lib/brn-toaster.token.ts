import { inject, InjectionToken, type ValueProvider } from '@angular/core';
import type { ToastClassnames } from './types';

export interface BrnSonnerToasterConfig {
	/** The maximum number of toasts visible at once */
	visibleToastsAmount: number;
	/** The offset from the viewport for the toast container */
	viewPortOffset: string;
	/** The default lifetime of a toast in milliseconds */
	toastLifetime: number;
	/** The width of the toast in pixels */
	toastWidth: number;
	/** The gap between toasts in pixels */
	gap: number;
	/** The threshold in pixels for swipe to dismiss a toast */
	swipeThreshold: number;
	/** The time in milliseconds before a toast is unmounted */
	timeBeforeUnmount: number;
}

const defaultConfig: BrnSonnerToasterConfig = {
	visibleToastsAmount: 3,
	viewPortOffset: '32px',
	toastLifetime: 4000,
	toastWidth: 356,
	gap: 14,
	swipeThreshold: 20,
	timeBeforeUnmount: 200,
};

const BrnSonnerToasterConfigToken = new InjectionToken<BrnSonnerToasterConfig>('BrnSonnerToasterConfig');

export function provideBrnSonnerToasterConfig(config: Partial<BrnSonnerToasterConfig>): ValueProvider {
	return { provide: BrnSonnerToasterConfigToken, useValue: { ...defaultConfig, ...config } };
}

export function injectBrnSonnerToasterConfig(): BrnSonnerToasterConfig {
	return inject(BrnSonnerToasterConfigToken, { optional: true }) ?? defaultConfig;
}

export const defaultClasses: ToastClassnames = {
	toast: '',
	title: '',
	description: '',
	loader: '',
	closeButton: '',
	cancelButton: '',
	actionButton: '',
	action: '',
	warning: '',
	error: '',
	success: '',
	default: '',
	info: '',
	loading: '',
};
