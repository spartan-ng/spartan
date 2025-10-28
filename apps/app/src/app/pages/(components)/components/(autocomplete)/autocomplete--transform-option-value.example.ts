import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmAutocompleteImports, provideHlmAutocompleteConfig } from '@spartan-ng/helm/autocomplete';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmLabelImports } from '@spartan-ng/helm/label';

type Item = {
	id: string;
	label: string;
};

@Component({
	selector: 'spartan-autocomplete-transform-option-value',
	imports: [HlmAutocompleteImports, ReactiveFormsModule, HlmButtonImports, HlmLabelImports],
	providers: [
		provideHlmAutocompleteConfig({
			transformOptionToString: (option: Item) => option.label,
		}),
	],
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-8">
			<div class="flex flex-col gap-2">
				<label for="autocomplete" hlmLabel class="px-1">Choose your favorite character</label>
				<hlm-autocomplete
					inputId="autocomplete"
					formControlName="option"
					[transformOptionToValue]="_transformOptionValue"
					[displayWith]="_displayWith"
					[filteredOptions]="filteredOptions()"
					[(search)]="search"
					showClearBtn
				/>
			</div>

			<button type="submit" hlmBtn>Submit</button>
		</form>
	`,
})
export class AutocompleteTransformOptionValue {
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _options: Item[] = [
		{ id: '1', label: 'Marty McFly' },
		{ id: '2', label: 'Doc Brown' },
		{ id: '3', label: 'Biff Tannen' },
		{ id: '4', label: 'George McFly' },
		{ id: '5', label: 'Jennifer Parker' },
		{ id: '6', label: 'Emmett Brown' },
		{ id: '7', label: 'Einstein' },
		{ id: '8', label: 'Clara Clayton' },
		{ id: '9', label: 'Needles' },
		{ id: '10', label: 'Goldie Wilson' },
		{ id: '11', label: 'Marvin Berry' },
		{ id: '12', label: 'Lorraine Baines' },
		{ id: '13', label: 'Strickland' },
	];

	protected _transformOptionValue = (option: Item) => option.id;

	protected _displayWith = (id: string) => this._options.find((option) => option.id === id)?.label ?? '';

	public readonly search = signal('');

	public form = this._formBuilder.group({
		option: ['10', Validators.required],
	});

	public readonly filteredOptions = computed(() => {
		return this._options.filter((option) => option.label.toLowerCase().includes(this.search().toLowerCase()));
	});

	submit() {
		console.log(this.form.value.option);
	}
}
