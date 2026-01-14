import { type ExistingProvider, inject, InjectionToken, type Type, type ValueProvider } from '@angular/core';
import type { BrnAutocomplete } from './brn-autocomplete';

export const BrnAutocompleteToken = new InjectionToken<BrnAutocomplete<unknown>>('BrnAutocompleteToken');

export function provideBrnAutocomplete<T>(autocomplete: Type<BrnAutocomplete<T>>): ExistingProvider {
	return { provide: BrnAutocompleteToken, useExisting: autocomplete };
}

export function injectBrnAutocomplete<T>(): BrnAutocomplete<T> {
	return inject(BrnAutocompleteToken) as BrnAutocomplete<T>;
}

// config
export type AutocompleteItemEqualToValue<T> = (itemValue: T, selectedValue: T | null) => boolean;
export type AutocompleteItemToString<T> = (itemValue: T) => string;

export interface BrnAutocompleteConfig<T> {
	isItemEqualToValue: AutocompleteItemEqualToValue<T>;
	itemToString?: AutocompleteItemToString<T>;
}

function getDefaultConfig<T>(): BrnAutocompleteConfig<T> {
	return {
		isItemEqualToValue: (itemValue: T, selectedValue: T | null) => Object.is(itemValue, selectedValue),
		itemToString: undefined,
	};
}

const BrnAutocompleteConfigToken = new InjectionToken<BrnAutocompleteConfig<unknown>>('BrnAutocompleteConfig');

export function provideBrnAutocompleteConfig<T>(config: Partial<BrnAutocompleteConfig<T>>): ValueProvider {
	return { provide: BrnAutocompleteConfigToken, useValue: { ...getDefaultConfig(), ...config } };
}

export function injectBrnAutocompleteConfig<T>(): BrnAutocompleteConfig<T> {
	const injectedConfig = inject(BrnAutocompleteConfigToken, { optional: true });
	return injectedConfig ? (injectedConfig as BrnAutocompleteConfig<T>) : getDefaultConfig();
}
