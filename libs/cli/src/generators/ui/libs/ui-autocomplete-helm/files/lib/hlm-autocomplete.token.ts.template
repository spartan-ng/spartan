import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export type TransformValueToString<T> = (option: T) => string;

export interface HlmAutocompleteConfig<T> {
	transformValueToSearch: TransformValueToString<T>;
	transformOptionToString: TransformValueToString<T>;
}

function getDefaultConfig<T>(): HlmAutocompleteConfig<T> {
	return {
		transformValueToSearch: (option: T) => (typeof option === 'string' ? option : String(option)),
		transformOptionToString: (option: T) => (typeof option === 'string' ? option : String(option)),
	};
}

const HlmAutocompleteConfigToken = new InjectionToken<HlmAutocompleteConfig<unknown>>('HlmAutocompleteConfig');

export function provideHlmAutocompleteConfig<T>(config: Partial<HlmAutocompleteConfig<T>>): ValueProvider {
	return { provide: HlmAutocompleteConfigToken, useValue: { ...getDefaultConfig(), ...config } };
}

export function injectHlmAutocompleteConfig<T>(): HlmAutocompleteConfig<T> {
	return inject(HlmAutocompleteConfigToken, { optional: true }) ?? getDefaultConfig();
}
