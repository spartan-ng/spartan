import { type ExistingProvider, InjectionToken, type Type } from '@angular/core';
import type { BrnAutocompleteItem } from './brn-autocomplete-item';

export const BrnAutocompleteItemToken = new InjectionToken<BrnAutocompleteItem<unknown>>('BrnAutocompleteItemToken');

export function provideBrnAutocompleteItem<T>(autocomplete: Type<BrnAutocompleteItem<T>>): ExistingProvider {
	return { provide: BrnAutocompleteItemToken, useExisting: autocomplete };
}
