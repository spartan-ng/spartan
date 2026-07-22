import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-combobox-form-multiple-preview',
	imports: [HlmComboboxImports, FormRoot, FormField, HlmButton, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'w-full max-w-xs' },
	template: `
		<form [formRoot]="form">
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="frameworks">Select frameworks</label>
					<hlm-combobox-multiple [formField]="form.framework">
						<hlm-combobox-chips class="max-w-xs">
							<ng-template hlmComboboxValues let-values>
								@for (value of values; track $index) {
									<hlm-combobox-chip [value]="value">{{ value }}</hlm-combobox-chip>
								}
							</ng-template>

							<input hlmComboboxChipInput id="frameworks" />
						</hlm-combobox-chips>
						<hlm-combobox-content *hlmComboboxPortal>
							<hlm-combobox-empty>No items found.</hlm-combobox-empty>
							<div hlmComboboxList>
								@for (framework of frameworks; track $index) {
									<hlm-combobox-item [value]="framework">{{ framework }}</hlm-combobox-item>
								}
							</div>
						</hlm-combobox-content>
					</hlm-combobox-multiple>
				</hlm-field>
				<hlm-field orientation="horizontal">
					<button type="submit" hlmBtn [disabled]="form().submitting()">Submit</button>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class ComboboxFormMultiplePreview {
	protected readonly _model = signal<{ framework: string[] }>({ framework: ['Analog'] });

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.framework, { message: 'Please select at least one framework' });
			minLength(schemaPath.framework, 1, { message: 'Please select at least one framework' });
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

	public frameworks = ['Analog', 'Angular', 'Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];
}
