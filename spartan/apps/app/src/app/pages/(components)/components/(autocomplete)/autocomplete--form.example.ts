import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-autocomplete-form',
	imports: [HlmAutocompleteImports, ReactiveFormsModule, HlmButtonImports, HlmLabelImports],
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-8">
			<div class="flex flex-col gap-2">
				<label for="autocomplete" hlmLabel class="px-1">Choose your favorite character</label>
				<hlm-autocomplete
					inputId="autocomplete"
					[filteredOptions]="filteredOptions()"
					[(search)]="search"
					formControlName="option"
				/>
			</div>

			<button type="submit" hlmBtn>Submit</button>
		</form>
	`,
})
export class AutocompleteForm {
	private readonly _formBuilder = inject(FormBuilder);
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

	public form = this._formBuilder.group({
		option: [null, Validators.required],
	});

	public readonly filteredOptions = computed(() =>
		this._options.filter((option) => option.toLowerCase().includes(this.search().toLowerCase())),
	);

	submit() {
		console.log(this.form.value);
	}
}
