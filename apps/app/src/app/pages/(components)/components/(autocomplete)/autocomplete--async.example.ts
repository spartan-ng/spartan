import { Component, resource, signal } from '@angular/core';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-autocomplete-async',
	imports: [HlmAutocompleteImports, HlmSpinnerImports],
	template: `
		<hlm-autocomplete [filteredOptions]="options.value()" [loading]="options.isLoading()" [(search)]="search">
			<hlm-spinner loading class="size-6" />
		</hlm-autocomplete>
	`,
})
export class AutocompleteAsync {
	public readonly search = signal('');

	public options = resource({
		defaultValue: [],
		params: () => ({ search: this.search() }),
		loader: async ({ params }) => {
			const search = params.search;

			if (search.length === 0) {
				return [];
			}

			// Simulate empty state
			if (search === 'empty') {
				return [];
			}

			// DEV - call your API or 3rd party service here
			// simulate async
			return new Promise<string[]>((resolve) => {
				setTimeout(() => {
					const newOptions = Array.from({ length: 15 }, (_, i) => `${search}-${i + 1}`);
					resolve(newOptions);
				}, 500);
			});
		},
	});
}
