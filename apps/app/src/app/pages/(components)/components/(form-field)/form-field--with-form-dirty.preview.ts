import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmSelectImports, HlmSelectModule } from '@spartan-ng/ui-select-helm';

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

export const formFieldFormWithDirtyCode = `
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports, HlmSelectModule } from '@spartan-ng/ui-select-helm';

@Component({
	standalone: true,
	selector: 'spartan-form-field-form',
	imports: [
		ReactiveFormsModule,
		HlmFormFieldModule,
		HlmSelectModule,
		HlmInputDirective,
		HlmSelectImports,
		BrnSelectImports,
		HlmButtonModule,
	],
	template: \`
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
	\`,
  providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
})
export class FormFieldFormWithDirtyPreviewComponent {
	private _formBuilder = inject(FormBuilder);

	form = this._formBuilder.group({
		name: ['', Validators.required],
		fruit: ['', Validators.required],
	});

	options = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'blueberry', label: 'Blueberry' },
		{ value: 'grapes', label: 'Grapes' },
		{ value: 'pineapple', label: 'Pineapple' },
	];
}
`;
