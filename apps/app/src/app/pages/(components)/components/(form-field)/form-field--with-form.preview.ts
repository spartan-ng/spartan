import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-form-field-form',
	imports: [ReactiveFormsModule, HlmFormFieldImports, HlmSelectImports, HlmInput, HlmSelectImports, HlmButtonImports],
	template: `
		<form [formGroup]="form" class="space-y-6">
			<hlm-form-field>
				<input
					aria-label="Your Name"
					formControlName="name"
					class="w-80"
					hlmInput
					type="text"
					placeholder="Your Name"
				/>
				<hlm-error>Your name is required</hlm-error>
			</hlm-form-field>
			<hlm-form-field>
				<hlm-select class="inline-block" placeholder="Select some fruit" formControlName="fruit">
					<hlm-select-trigger />
					<hlm-select-content>
						<hlm-select-label>Fruits</hlm-select-label>
						@for (option of options; track option.value) {
							<hlm-option [value]="option.value">{{ option.label }}</hlm-option>
						}
					</hlm-select-content>
				</hlm-select>
				<hlm-error>The fruit is required</hlm-error>
			</hlm-form-field>

			<button type="submit" hlmBtn>Submit</button>
		</form>
	`,
})
export class FormFieldFormPreview {
	private readonly _formBuilder = inject(FormBuilder);

	public form = this._formBuilder.group({
		name: ['', Validators.required],
		fruit: ['', Validators.required],
	});

	public options = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'blueberry', label: 'Blueberry' },
		{ value: 'grapes', label: 'Grapes' },
		{ value: 'pineapple', label: 'Pineapple' },
	];
}
