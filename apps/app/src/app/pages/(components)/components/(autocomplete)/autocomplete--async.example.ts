import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HlmAutocomplete } from '@spartan-ng/helm/autocomplete';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-autocomplete-async',
	imports: [HlmAutocomplete, HlmSpinner],
	template: `
		<hlm-autocomplete [options]="options.value()" [loading]="options.isLoading()" (filterChange)="_filter.set($event)">
			<hlm-spinner loading class="size-6" />
		</hlm-autocomplete>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteAsync {
	private readonly _formBuilder = inject(FormBuilder);

	public form = this._formBuilder.group({
		option: [null, Validators.required],
	});

	protected readonly _filter = signal<string>('');

	public options = resource({
		defaultValue: [],
		request: () => ({ filter: this._filter() }),
		loader: async (params) => {
			const filter = params.request.filter;

			if (filter.length === 0) {
				return [];
			}

			// Simulate empty state
			if (filter === 'empty') {
				return [];
			}

			// TODO call your API or 3rd party service here
			// simulate async
			return new Promise<string[]>((resolve) => {
				setTimeout(() => {
					const newOptions = Array.from({ length: 15 }, (_, i) => `${filter}-${i + 1}`);
					resolve(newOptions);
				}, 500);
			});
		},
	});

	submit() {
		console.log(this.form.value);
	}
}
