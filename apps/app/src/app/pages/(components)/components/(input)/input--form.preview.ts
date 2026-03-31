import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-form',
	imports: [HlmInputImports, HlmButtonImports, HlmFieldImports, ReactiveFormsModule],
	template: `
		<form class="space-y-6" [formGroup]="form" (ngSubmit)="submit()">
			<hlm-field>
				<label hlmFieldLabel for="username">Username</label>
				<input hlmInput type="text" id="username" placeholder="spartan" formControlName="username" />
				<p hlmFieldDescription>This is your public display name.</p>
			</hlm-field>
			<hlm-field orientation="horizontal">
				<button hlmBtn type="submit">Submit</button>
			</hlm-field>
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
