import { type ExistingProvider, InjectionToken, type Type } from '@angular/core';
import type { BrnAutocompleteSearchInput } from './brn-autocomplete-search-input';

export const BrnAutocompleteSearchInputToken = new InjectionToken<BrnAutocompleteSearchInput>(
	'BrnAutocompleteSearchInputToken',
);

export function provideBrnAutocompleteSearchInput(autocomplete: Type<BrnAutocompleteSearchInput>): ExistingProvider {
	return { provide: BrnAutocompleteSearchInputToken, useExisting: autocomplete };
}
