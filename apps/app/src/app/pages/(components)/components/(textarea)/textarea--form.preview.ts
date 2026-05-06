import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-textarea-form',
	imports: [HlmTextareaImports, HlmLabelImports, HlmButtonImports, HlmFieldImports, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'min-w-sm',
	},
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()">
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="username">Bio</label>
					<textarea
						hlmTextarea
						class="w-80"
						id="username"
						placeholder="Tell us a little bit about yourself"
						formControlName="bio"
					></textarea>
					<p hlmFieldDescription>
						You can
						<span>&#64;mention</span>
						other users and organizations.
					</p>
				</hlm-field>
				<hlm-field orientation="horizontal">
					<button hlmBtn type="submit">Submit</button>
				</hlm-field>
			</hlm-field-group>
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
