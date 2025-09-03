import { ExistingProvider, inject, InjectionToken, Type, ValueProvider } from '@angular/core';
import type { BrnAutocomplete } from './brn-autocomplete';

export const BrnAutocompleteToken = new InjectionToken<BrnAutocomplete<unknown>>('BrnAutocompleteToken');

export function provideBrnAutocomplete<T>(autocomplete: Type<BrnAutocomplete<T>>): ExistingProvider {
	return { provide: BrnAutocompleteToken, useExisting: autocomplete };
}

export function injectBrnAutocomplete<T>(): BrnAutocomplete<T> {
	return inject(BrnAutocompleteToken) as BrnAutocomplete<T>;
}

// TODO is that needed?
export interface BrnAutocompleteConfig<T> {}

function getDefaultConfig<T>(): BrnAutocompleteConfig<T> {
	return {};
}

const BrnAutocompleteConfigToken = new InjectionToken<BrnAutocompleteConfig<unknown>>('BrnAutocompleteConfig');

export function provideBrnAutocompleteConfig<T>(config: Partial<BrnAutocompleteConfig<T>>): ValueProvider {
	return { provide: BrnAutocompleteConfigToken, useValue: { ...getDefaultConfig(), ...config } };
}

export function injectBrnAutocompleteConfig<T>(): BrnAutocompleteConfig<T> {
	return inject(BrnAutocompleteConfigToken, { optional: true }) ?? getDefaultConfig();
}
