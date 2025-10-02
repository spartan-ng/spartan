import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-textarea-form',
	imports: [HlmInputImports, HlmLabelImports, HlmButtonImports, HlmFormFieldImports, ReactiveFormsModule],
	template: `
		<form class="space-y-6" [formGroup]="form" (ngSubmit)="submit()">
			<div class="grid w-full max-w-sm items-center gap-2">
				<label hlmLabel for="username">Bio</label>
				<textarea
					class="min-h-16 w-80"
					hlmInput
					id="username"
					placeholder="Tell us a little bit about yourself"
					formControlName="bio"
				></textarea>
				<hlm-hint>
					You can
					<span>&#64;mention</span>
					other users and organizations.
				</hlm-hint>
			</div>
			<button hlmBtn type="submit">Submit</button>
		</form>
	`,
})
export class TextareaFormPreview {
	private readonly _formBuilder = inject(FormBuilder);
	public form = this._formBuilder.group({
		bio: [null, Validators.required],
	});

	submit() {
		console.log(this.form.value);
	}
}
