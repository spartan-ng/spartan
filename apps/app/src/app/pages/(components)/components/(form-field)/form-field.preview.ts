import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

@Component({
	selector: 'spartan-form-field-preview',
	imports: [HlmInputDirective, HlmFormFieldModule, ReactiveFormsModule],
	template: `
		<hlm-form-field>
			<input class="w-80" hlmInput [formControl]="control" type="email" placeholder="Email" />
			<hlm-hint>This is your email address.</hlm-hint>
			<hlm-error>The email is required.</hlm-error>
		</hlm-form-field>
	`,
})
export class FormFieldPreviewComponent {
	public control = new FormControl('', Validators.required);
}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

@Component({
	selector: 'spartan-form-field-preview',
	standalone: true,
	imports: [HlmInputDirective, HlmFormFieldModule],
	template: \`
		<hlm-form-field>
			<input class="w-80" hlmInput type="email" placeholder="Email" />
			<hlm-hint>This is your email address.</hlm-hint>
		</hlm-form-field>
	\`,
})
export class FormFieldPreviewComponent {}
`;

export const defaultImports = `
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
`;
export const defaultSkeleton = `
<hlm-form-field>
	<input class="w-80" hlmInput type="email" placeholder="Email" />
	<hlm-hint>This is your email address.</hlm-hint>
</hlm-form-field>
`;
