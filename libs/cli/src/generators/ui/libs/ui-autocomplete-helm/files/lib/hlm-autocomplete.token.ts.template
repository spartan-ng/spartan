import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export type TransformValueToString<T> = (value: T) => string;

export interface HlmAutocompleteConfig<T> {
	transformValueToSearch: TransformValueToString<T>;
}

function getDefaultConfig<T>(): HlmAutocompleteConfig<T> {
	return {
		transformValueToSearch: (value: T) => (typeof value === 'string' ? value : String(value)),
	};
}

const HlmAutocompleteConfigToken = new InjectionToken<HlmAutocompleteConfig<unknown>>('HlmAutocompleteConfig');

export function provideHlmAutocompleteConfig<T>(config: Partial<HlmAutocompleteConfig<T>>): ValueProvider {
	return { provide: HlmAutocompleteConfigToken, useValue: { ...getDefaultConfig(), ...config } };
}

export function injectHlmAutocompleteConfig<T>(): HlmAutocompleteConfig<T> {
	return inject(HlmAutocompleteConfigToken, { optional: true }) ?? getDefaultConfig();
}
