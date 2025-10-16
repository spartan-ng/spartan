import { type ExistingProvider, inject, InjectionToken, type Type } from '@angular/core';
import type { BrnAutocomplete } from './brn-autocomplete';

export const BrnAutocompleteToken = new InjectionToken<BrnAutocomplete<unknown>>('BrnAutocompleteToken');

export function provideBrnAutocomplete<T>(autocomplete: Type<BrnAutocomplete<T>>): ExistingProvider {
	return { provide: BrnAutocompleteToken, useExisting: autocomplete };
}

export function injectBrnAutocomplete<T>(): BrnAutocomplete<T> {
	return inject(BrnAutocompleteToken) as BrnAutocomplete<T>;
}
