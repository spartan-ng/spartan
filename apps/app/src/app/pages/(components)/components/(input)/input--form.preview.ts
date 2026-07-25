import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-form',
	imports: [HlmInputImports, HlmButtonImports, HlmFieldImports, FormRoot, FormField],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-xs sm:min-w-sm' },
	template: `
		<form [formRoot]="form">
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="form-name">Name</label>
					<input hlmInput type="text" id="form-name" placeholder="Leonidas" [formField]="form.name" />
				</hlm-field>
				<hlm-field>
					<label hlmFieldLabel for="form-email">Email</label>
					<input hlmInput type="email" id="form-email" placeholder="leonidas@example.com" [formField]="form.email" />
					<hlm-field-description>We'll never share your email with anyone.</hlm-field-description>
				</hlm-field>
				<hlm-field>
					<label hlmFieldLabel for="form-address">Address</label>
					<input hlmInput type="text" id="form-address" placeholder="123 Main St" [formField]="form.address" />
				</hlm-field>
				<hlm-field orientation="horizontal">
					<button hlmBtn variant="outline" type="button" (click)="reset()">Cancel</button>
					<button hlmBtn type="submit">Submit</button>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class InputFormPreview {
	protected readonly _model = signal({
		name: '',
		email: '',
		address: '',
	});

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.name, { message: 'Name is required' });
			required(schemaPath.email, { message: 'Email is required' });
			email(schemaPath.email, { message: 'Enter a valid email address' });
		},
		{
			submission: {
				action: async () => {
					const model = this._model();
					console.log(model);
				},
			},
		},
	);

	public reset() {
		this.form().reset({
			name: '',
			email: '',
			address: '',
		});
	}
}
