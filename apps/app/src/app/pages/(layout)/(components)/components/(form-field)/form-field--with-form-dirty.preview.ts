import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonModule } from '@spartan-ng/helm/button';
import { HlmFormFieldModule } from '@spartan-ng/helm/form-field';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmSelectImports, HlmSelectModule } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-form-field-form-dirty',
	imports: [
		ReactiveFormsModule,
		HlmFormFieldModule,
		HlmSelectModule,
		HlmInputDirective,
		HlmSelectImports,
		BrnSelectImports,
		HlmButtonModule,
	],
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
				<brn-select class="inline-block" placeholder="Select some fruit" formControlName="fruit">
					<hlm-select-trigger class="w-80">
						<hlm-select-value />
					</hlm-select-trigger>
					<hlm-select-content>
						<hlm-select-label>Fruits</hlm-select-label>
						@for (option of options; track option.value) {
							<hlm-option [value]="option.value">{{ option.label }}</hlm-option>
						}
					</hlm-select-content>
				</brn-select>
				<hlm-error>The fruit is required</hlm-error>
			</hlm-form-field>

			<button type="submit" hlmBtn>Submit</button>
		</form>
	`,
	providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
})
export class FormFieldFormWithDirtyPreviewComponent {
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

export const providerShowOnDirtyErrorStateMatcher = `
 providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ]
`;
