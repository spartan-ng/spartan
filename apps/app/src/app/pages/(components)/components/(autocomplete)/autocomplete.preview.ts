import { Component, computed, signal } from '@angular/core';
import { HlmAutocomplete } from '@spartan-ng/helm/autocomplete';

@Component({
	selector: 'spartan-autocomplete-preview',
	imports: [HlmAutocomplete],
	template: `
		<hlm-autocomplete [filteredOptions]="filteredOptions()" [(search)]="search" />
	`,
})
export class AutocompletePreview {
	private readonly _options: string[] = [
		'Marty McFly',
		'Doc Brown',
		'Biff Tannen',
		'George McFly',
		'Jennifer Parker',
		'Emmett Brown',
		'Einstein',
		'Clara Clayton',
		'Needles',
		'Goldie Wilson',
		'Marvin Berry',
		'Lorraine Baines',
		'Strickland',
	];

	public readonly search = signal('');

	public readonly filteredOptions = computed(() =>
		this._options.filter((option) => option.toLowerCase().includes(this.search().toLowerCase())),
	);
}

export const defaultImports = `
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
`;

export const defaultSkeleton = `
<hlm-autocomplete [options]="options" />
`;
