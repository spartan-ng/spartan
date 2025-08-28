import { ChangeDetectionStrategy, Component, resource, signal } from '@angular/core';
import { HlmAutocomplete } from '@spartan-ng/helm/autocomplete';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-autocomplete-async',
	imports: [HlmAutocomplete, HlmSpinner],
	template: `
		<hlm-autocomplete [options]="options.value()" [loading]="options.isLoading()" (searchChange)="_search.set($event)">
			<hlm-spinner loading class="size-6" />
		</hlm-autocomplete>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteAsync {
	protected readonly _search = signal<string>('');

	public options = resource({
		defaultValue: [],
		request: () => ({ search: this._search() }),
		loader: async (params) => {
			const search = params.request.search;

			if (search.length === 0) {
				return [];
			}

			// Simulate empty state
			if (search === 'empty') {
				return [];
			}

			// TODO call your API or 3rd party service here
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
