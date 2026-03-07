import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmNativeSelect, HlmNativeSelectImports } from '@spartan-ng/helm/native-select';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

export default {
	title: 'Native Select',
	component: HlmNativeSelect,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmNativeSelectImports, HlmFieldImports, ReactiveFormsModule, HlmButton],
		}),
	],
} as Meta<HlmNativeSelect>;

type Story = StoryObj<HlmNativeSelect>;

export const Default: Story = {
	render: () => ({
		template: `
<hlm-native-select>
  <option hlmNativeSelectOption value="">Select a fruit</option>
  <option hlmNativeSelectOption value="apple">Apple</option>
  <option hlmNativeSelectOption value="banana">Banana</option>
  <option hlmNativeSelectOption value="blueberry">Blueberry</option>
  <option hlmNativeSelectOption value="pineapple">Pineapple</option>
</hlm-native-select>
		`,
	}),
};

export const WithHintAndError: Story = {
	render: (args) => ({
		props: {
			...args,
			form: new FormGroup({
				fruit: new FormControl('', { validators: [Validators.required] }),
			}),
		},
		template: /* HTML */ `
			@let control = form.get('fruit'); @let showError = control?.invalid && (control?.touched || control?.dirty);

			<form [formGroup]="form" class="w-full max-w-sm space-y-3">
				<div hlmField [attr.data-invalid]="showError ? 'true' : null">
					<label hlmFieldLabel for="select-fruit">Fruit *</label>
					<hlm-native-select id="select-fruit" formControlName="fruit">
						<option hlmNativeSelectOption value="">Select a fruit</option>
						<option hlmNativeSelectOption value="apple">Apple</option>
						<option hlmNativeSelectOption value="banana">Banana</option>
						<option hlmNativeSelectOption value="blueberry">Blueberry</option>
						<option hlmNativeSelectOption value="pineapple">Pineapple</option>
					</hlm-native-select>

					<p hlmFieldDescription>Pick a fruit so we can tailor the recommendations.</p>

					@if(showError){
					<hlm-field-error>Select your favorite fruit to continue.</hlm-field-error>
					}
				</div>

				<div class="flex flex-wrap items-center gap-2">
					<button hlmBtn type="button" (click)="form.markAllAsTouched()">Validate</button>
					<button hlmBtn variant="outline" type="button" (click)="form.reset()">Reset</button>
				</div>
			</form>
		`,
	}),
};
