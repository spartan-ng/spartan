import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-combobox-form-preview',
	imports: [HlmComboboxImports, FormRoot, FormField, HlmButton, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'w-full max-w-xs' },
	template: `
		<form [formRoot]="form">
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="framework">Select a framework</label>
					<hlm-combobox [formField]="form.framework">
						<hlm-combobox-input inputId="framework" placeholder="e.g. Analog" />
						<hlm-combobox-content *hlmComboboxPortal>
							<hlm-combobox-empty>No items found.</hlm-combobox-empty>
							<div hlmComboboxList>
								@for (framework of frameworks; track $index) {
									<hlm-combobox-item [value]="framework">{{ framework }}</hlm-combobox-item>
								}
							</div>
						</hlm-combobox-content>
					</hlm-combobox>
				</hlm-field>
				<hlm-field orientation="horizontal">
					<button type="submit" hlmBtn [disabled]="form().submitting()">Submit</button>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class ComboboxFormPreview {
	protected readonly _model = signal<{ framework: string | null }>({ framework: null });

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.framework, { message: 'Please select a framework' });
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
