import { NgModule } from '@angular/core';
import { HlmAutocomplete } from './lib/hlm-autocomplete';
import { HlmAutocompleteTrigger } from './lib/hlm-autocomplete-trigger';

export * from './lib/hlm-autocomplete';
export * from './lib/hlm-autocomplete-trigger';

export const HlmAutocompleteImports = [HlmAutocomplete, HlmAutocompleteTrigger] as const;

@NgModule({
	imports: [...HlmAutocompleteImports],
	exports: [...HlmAutocompleteImports],
})
export class HlmAutocompleteModule {}
