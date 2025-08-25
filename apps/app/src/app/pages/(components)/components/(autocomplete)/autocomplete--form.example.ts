import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmAutocomplete } from '@spartan-ng/helm/autocomplete';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmLabel } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-autocomplete-form',
	imports: [HlmAutocomplete, ReactiveFormsModule, HlmButton, HlmLabel],
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-8">
			<div class="flex flex-col gap-2">
				<label for="autocomplete" hlmLabel class="px-1">Choose your favorite character</label>
				<hlm-autocomplete inputId="autocomplete" [options]="options" formControlName="option" />
			</div>

			<button type="submit" hlmBtn>Submit</button>
		</form>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteForm {
	private readonly _formBuilder = inject(FormBuilder);

	public form = this._formBuilder.group({
		option: [null, Validators.required],
	});

	public readonly options: string[] = [
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

	submit() {
		console.log(this.form.value);
	}
}
