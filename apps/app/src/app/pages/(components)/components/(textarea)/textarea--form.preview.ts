import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-textarea-form',
	imports: [HlmTextareaImports, HlmLabelImports, HlmButtonImports, HlmFieldImports, FormRoot, FormField],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-xs sm:min-w-sm' },
	template: `
		<form [formRoot]="form">
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="username">Bio</label>
					<textarea
						hlmTextarea
						class="w-80"
						id="username"
						placeholder="Tell us a little bit about yourself"
						[formField]="form.bio"
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
	protected readonly _model = signal({
		bio: '',
	});

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.bio, { message: 'Bio is required' });
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
}
