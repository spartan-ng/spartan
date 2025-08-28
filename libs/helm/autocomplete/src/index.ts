import { NgModule } from '@angular/core';
import { HlmAutocomplete } from './lib/hlm-autocomplete';
import { HlmAutocompleteCommand } from './lib/hlm-autocomplete-command';
import { HlmAutocompleteSearch } from './lib/hlm-autocomplete-search';
import { HlmAutocompleteSearchInput } from './lib/hlm-autocomplete-search-input';
import { HlmAutocompleteTrigger } from './lib/hlm-autocomplete-trigger';

export * from './lib/hlm-autocomplete';
export * from './lib/hlm-autocomplete-command';
export * from './lib/hlm-autocomplete-search';
export * from './lib/hlm-autocomplete-search-input';
export * from './lib/hlm-autocomplete-trigger';

export const HlmAutocompleteImports = [
	HlmAutocomplete,
	HlmAutocompleteCommand,
	HlmAutocompleteSearch,
	HlmAutocompleteSearchInput,
	HlmAutocompleteTrigger,
] as const;

@NgModule({
	imports: [...HlmAutocompleteImports],
	exports: [...HlmAutocompleteImports],
})
export class HlmAutocompleteModule {}
