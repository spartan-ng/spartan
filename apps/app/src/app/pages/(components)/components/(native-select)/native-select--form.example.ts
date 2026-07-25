import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';

@Component({
	selector: 'spartan-native-select-form-example',
	imports: [FormRoot, FormField, HlmNativeSelectImports, HlmFieldImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full max-w-xs',
	},
	template: `
		<form [formRoot]="form">
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="fruit">Favorite Fruit</label>
					<hlm-native-select selectId="fruit" [formField]="form.fruit">
						<option hlmNativeSelectOption value="">Select a fruit</option>
						<option hlmNativeSelectOption value="apple">Apple</option>
						<option hlmNativeSelectOption value="banana">Banana</option>
						<option hlmNativeSelectOption value="blueberry">Blueberry</option>
					</hlm-native-select>
				</hlm-field>
				<hlm-field orientation="horizontal">
					<button hlmBtn type="submit" [disabled]="form().submitting()">Submit</button>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class NativeSelectFormExample {
	protected readonly _model = signal<{ fruit: string | null }>({ fruit: null });

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.fruit, { message: 'Please select a fruit' });
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
