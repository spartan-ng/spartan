import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-input-form',
	imports: [HlmInputImports, HlmLabelImports, HlmButtonImports, HlmFormFieldImports, ReactiveFormsModule],
	template: `
		<form class="space-y-6" [formGroup]="form" (ngSubmit)="submit()">
			<div class="grid w-full max-w-sm items-center gap-2">
				<label hlmLabel for="username">Username</label>
				<input hlmInput type="text" id="username" placeholder="spartan" formControlName="username" />
				<hlm-hint>This is your public display name.</hlm-hint>
			</div>
			<button hlmBtn type="submit">Submit</button>
		</form>
	`,
})
export class InputFormPreview {
	private readonly _formBuilder = inject(FormBuilder);
	public form = this._formBuilder.group({
		username: [null, Validators.required],
	});

	submit() {
		console.log(this.form.value);
	}
}
