import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HlmAutocomplete } from '@spartan-ng/helm/autocomplete';

@Component({
	selector: 'spartan-autocomplete-async',
	imports: [HlmAutocomplete],
	template: `
		<hlm-autocomplete [options]="options.value()" (filterChange)="_filter.set($event)" />
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
