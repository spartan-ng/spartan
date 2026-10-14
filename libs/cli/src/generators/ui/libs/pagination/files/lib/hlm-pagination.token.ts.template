import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface HlmPaginationConfig {
	totalItemsLabel: string;
	pagesLabel: string;
	previousLabel: string;
	previousAriaLabel: string;
	nextLabel: string;
	nextAriaLabel: string;
}

const defaultConfig: HlmPaginationConfig = {
	totalItemsLabel: 'total items',
	pagesLabel: 'pages',
	nextLabel: 'Next',
	nextAriaLabel: 'Go to next page',
	previousLabel: 'Previous',
	previousAriaLabel: 'Go to previous page',
};

const HlmPaginationConfigToken = new InjectionToken<HlmPaginationConfig>('HlmPaginationConfig');

export function provideHlmPaginationConfig(config: Partial<HlmPaginationConfig>): ValueProvider {
	return { provide: HlmPaginationConfigToken, useValue: { ...defaultConfig, ...config } };
}

export function injectHlmPaginationConfig(): HlmPaginationConfig {
	return inject(HlmPaginationConfigToken, { optional: true }) ?? defaultConfig;
}
