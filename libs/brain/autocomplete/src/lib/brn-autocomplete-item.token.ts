import { ExistingProvider, InjectionToken, Type } from '@angular/core';
import { BrnAutocompleteItem } from './brn-autocomplete-item';

export const BrnAutocompleteItemToken = new InjectionToken<BrnAutocompleteItem<unknown>>('BrnAutocompleteItemToken');

export function provideBrnAutocompleteItem<T>(autocomplete: Type<BrnAutocompleteItem<T>>): ExistingProvider {
	return { provide: BrnAutocompleteItemToken, useExisting: autocomplete };
}
