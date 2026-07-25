import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-select-form-preview',
	imports: [HlmFieldImports, HlmSelectImports, HlmButtonImports, FormRoot, FormField],
	host: {
		class: 'w-full max-w-xs',
	},
	template: `
		<form [formRoot]="form">
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="fruit">Fruit</label>
					<hlm-select [formField]="form.fruit" [itemToString]="itemToString">
						<hlm-select-trigger buttonId="fruit" class="w-56">
							<hlm-select-value placeholder="Select a fruit" />
						</hlm-select-trigger>
						<hlm-select-content *hlmSelectPortal>
							<hlm-select-group>
								<hlm-select-label>Fruits</hlm-select-label>
								@for (item of items; track item.value) {
									<hlm-select-item [value]="item.value">{{ item.label }}</hlm-select-item>
								}
							</hlm-select-group>
						</hlm-select-content>
					</hlm-select>
				</hlm-field>
				<hlm-field orientation="horizontal">
					<button type="submit" hlmBtn>Submit</button>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class SelectFormPreview {
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

	public readonly items = [
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Blueberry', value: 'blueberry' },
		{ label: 'Grapes', value: 'grapes' },
		{ label: 'Pineapple', value: 'pineapple' },
	];
	public readonly itemToString = (value: string) => this.items.find((item) => item.value === value)?.label || '';
}
