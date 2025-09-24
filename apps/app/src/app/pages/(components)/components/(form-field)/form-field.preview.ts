import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-form-field-preview',
	imports: [HlmInputImports, HlmFormFieldImports, ReactiveFormsModule],
	template: `
		<hlm-form-field>
			<input class="w-80" hlmInput [formControl]="control" type="email" placeholder="Email" />
			<hlm-hint>This is your email address.</hlm-hint>
			<hlm-error>The email is required.</hlm-error>
		</hlm-form-field>
	`,
})
export class FormFieldPreview {
	public control = new FormControl('', Validators.required);
}

export const defaultImports = `
import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
import { HlmInputImports } from '@spartan-ng/helm/input';
`;
export const defaultSkeleton = `
<hlm-form-field>
	<input class="w-80" hlmInput type="email" placeholder="Email" />
	<hlm-hint>This is your email address.</hlm-hint>
</hlm-form-field>
`;
