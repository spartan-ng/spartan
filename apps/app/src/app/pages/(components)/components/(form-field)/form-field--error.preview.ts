import { Component, type OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

@Component({
	selector: 'spartan-form-field-error',
	imports: [ReactiveFormsModule, HlmFormFieldModule, HlmInputDirective],
	template: `
		<hlm-form-field>
			<input aria-label="Your Name" class="w-80" [formControl]="name" hlmInput type="text" placeholder="Your Name" />
			<hlm-error>Your name is required</hlm-error>
		</hlm-form-field>
	`,
})
export class FormFieldErrorPreviewComponent implements OnInit {
	public name = new FormControl('', Validators.required);

	ngOnInit(): void {
		this.name.markAsTouched();
	}
}

export const errorCode = `
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

@Component({
	standalone: true,
	selector: 'spartan-form-field-error',
	imports: [ReactiveFormsModule, HlmFormFieldModule, HlmInputDirective],
	template: \`
		<hlm-form-field>
			<input aria-label="Your Name" class="w-80" [formControl]="name" hlmInput type="text" placeholder="Your Name" />
			<hlm-error>Your name is required</hlm-error>
		</hlm-form-field>
	\`,
})
export class FormFieldErrorPreviewComponent implements OnInit {
	name = new FormControl('', Validators.required);

	ngOnInit(): void {
		this.name.markAsTouched();
	}
}
`;
