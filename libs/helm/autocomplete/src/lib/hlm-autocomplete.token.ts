import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export type TransformValueToString<T> = (option: T) => string;

export interface HlmAutocompleteConfig<T> {
	transformValueToSearch: TransformValueToString<T>;
	transformOptionToString: TransformValueToString<T>;
	transformOptionToValue: ((option: T) => any) | undefined;
	displayWith: ((value: any) => string) | undefined;
	requireSelection: boolean;
	showClearBtn: boolean;
	debounceTime: number;
}

function getDefaultConfig<T>(): HlmAutocompleteConfig<T> {
	return {
		transformValueToSearch: (option: T) => (typeof option === 'string' ? option : String(option)),
		transformOptionToString: (option: T) => (typeof option === 'string' ? option : String(option)),
		transformOptionToValue: undefined,
		displayWith: undefined,
		requireSelection: false,
		showClearBtn: false,
		debounceTime: 150,
	} as HlmAutocompleteConfig<T>;
}

const HlmAutocompleteConfigToken = new InjectionToken<HlmAutocompleteConfig<unknown>>('HlmAutocompleteConfig');

export function provideHlmAutocompleteConfig<T>(config: Partial<HlmAutocompleteConfig<T>>): ValueProvider {
	return { provide: HlmAutocompleteConfigToken, useValue: { ...getDefaultConfig(), ...config } };
}

export function injectHlmAutocompleteConfig<T>(): HlmAutocompleteConfig<T> {
	return inject(HlmAutocompleteConfigToken, { optional: true }) ?? getDefaultConfig();
}
