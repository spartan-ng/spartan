import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-form',
	imports: [HlmInputImports, HlmButtonImports, HlmFieldImports, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-sm' },
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()">
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="form-name">Name</label>
					<input hlmInput type="text" id="form-name" placeholder="Leonidas" formControlName="name" />
				</hlm-field>
				<hlm-field>
					<label hlmFieldLabel for="form-email">Email</label>
					<input hlmInput type="email" id="form-email" placeholder="leonidas@example.com" formControlName="email" />
					<hlm-field-description>We'll never share your email with anyone.</hlm-field-description>
				</hlm-field>
				<hlm-field>
					<label hlmFieldLabel for="form-address">Address</label>
					<input hlmInput type="text" id="form-address" placeholder="123 Main St" formControlName="address" />
				</hlm-field>
				<hlm-field orientation="horizontal">
					<button hlmBtn variant="outline" type="button">Cancel</button>
					<button hlmBtn type="submit">Submit</button>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class InputFormPreview {
	private readonly _formBuilder = inject(FormBuilder);
	public form = this._formBuilder.group({
		name: [null, Validators.required],
		email: [null, [Validators.required, Validators.email]],
		address: [null],
	});

	submit() {
		console.log(this.form.value);
	}
}
