import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSliderImports } from '@spartan-ng/helm/slider';

@Component({
	selector: 'spartan-slider-form',
	imports: [HlmSliderImports, FormRoot, FormField, HlmButtonImports, HlmFieldImports],
	host: { class: 'w-full max-w-xs' },
	template: `
		<form [formRoot]="form">
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="volume">Volume</label>
					<hlm-slider id="volume" [formField]="form.volume" />
					<p hlmFieldDescription>Set your speaker volume.</p>
				</hlm-field>
				<hlm-field orientation="horizontal">
					<button hlmBtn type="submit">Submit</button>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class SliderForm {
	protected readonly _model = signal<{ volume: number[] }>({ volume: [25] });

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.volume, { message: 'Volume is required' });
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
