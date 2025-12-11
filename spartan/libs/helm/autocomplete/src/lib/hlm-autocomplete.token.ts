import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export type TransformValueToString<T> = (option: T) => string;

export interface HlmAutocompleteConfig<T, V = T> {
	transformValueToSearch: TransformValueToString<T>;
	transformOptionToString: TransformValueToString<T>;
	transformOptionToValue: ((option: T) => V) | undefined;
	requireSelection: boolean;
	showClearBtn: boolean;
	debounceTime: number;
}

function getDefaultConfig<T, V = T>(): HlmAutocompleteConfig<T, V> {
	return {
		transformValueToSearch: (option: T) => (typeof option === 'string' ? option : String(option)),
		transformOptionToString: (option: T) => (typeof option === 'string' ? option : String(option)),
		transformOptionToValue: undefined,
		requireSelection: false,
		showClearBtn: false,
		debounceTime: 150,
	};
}

const HlmAutocompleteConfigToken = new InjectionToken<HlmAutocompleteConfig<unknown, unknown>>('HlmAutocompleteConfig');

export function provideHlmAutocompleteConfig<T, V = T>(config: Partial<HlmAutocompleteConfig<T, V>>): ValueProvider {
	return { provide: HlmAutocompleteConfigToken, useValue: { ...getDefaultConfig(), ...config } };
}

export function injectHlmAutocompleteConfig<T, V = T>(): HlmAutocompleteConfig<T, V> {
	return (
		(inject(HlmAutocompleteConfigToken, { optional: true }) as HlmAutocompleteConfig<T, V> | null) ?? getDefaultConfig()
	);
}
