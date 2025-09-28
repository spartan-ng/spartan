import { Component, inject, type OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButton, HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFormField, HlmFormFieldImports } from '@spartan-ng/helm/form-field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

const meta: Meta<HlmFormField> = {
	title: 'Form Field',
	component: HlmFormField,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmFormFieldImports, HlmInput, FormsModule, ReactiveFormsModule, HlmButton],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmFormField>;

export const Default: Story = {
	render: ({ ...args }) => ({
		props: { name: new FormControl('', Validators.required), ...args },
		template: `
			<hlm-form-field>
			 	<input aria-label='Your Name' [formControl]="name" class='w-80' hlmInput type='text' placeholder='Your Name'/>
				<hlm-error>Your name is required</hlm-error>
			</hlm-form-field>
		`,
	}),
};

@Component({
	selector: 'form-field-error-story',
	imports: [ReactiveFormsModule, HlmFormFieldImports, HlmInput],
	template: `
		<hlm-form-field>
			<input aria-label="Your Name" class="w-80" [formControl]="name" hlmInput type="text" placeholder="Your Name" />
			<hlm-error>Your name is required</hlm-error>
		</hlm-form-field>
	`,
})
class FormFieldErrorStory implements OnInit {
	name = new FormControl('', Validators.required);

	ngOnInit(): void {
		this.name.markAsTouched();
	}
}

export const Error: Story = {
	decorators: [
		moduleMetadata({
			imports: [FormFieldErrorStory],
		}),
	],
	render: () => ({
		template: '<form-field-error-story />',
	}),
};

export const Hint: Story = {
	render: ({ ...args }) => ({
		props: {
			...args,
		},
		template: `
		<hlm-form-field>
			<input aria-label='Your Name' class='w-80' hlmInput type='text' placeholder='shadcn'/>
			<hlm-hint>This is your public display name.</hlm-hint>
		</hlm-form-field>
		`,
	}),
};

@Component({
	selector: 'form-field-form-story',
	imports: [
		ReactiveFormsModule,
		HlmFormFieldImports,
		HlmSelectImports,
		HlmInput,
		HlmSelectImports,
		BrnSelectImports,
		HlmButtonImports,
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
})
class FormFieldFormStory {
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

export const FormWithDefaultErrorStateMatcher: Story = {
	decorators: [
		moduleMetadata({
			imports: [FormFieldFormStory],
		}),
	],
	render: () => ({
		template: '<form-field-form-story />',
	}),
};

export const FormWithDirtyErrorStateMatcher: Story = {
	decorators: [
		moduleMetadata({
			imports: [FormFieldFormStory],
			providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
		}),
	],
	render: () => ({
		template: '<form-field-form-story />',
	}),
};
