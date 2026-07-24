import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';

@Component({
	selector: 'spartan-radio-group-form',
	imports: [HlmRadioGroupImports, HlmLabelImports, HlmButtonImports, FormRoot, FormField],
	template: `
		<form class="space-y-6" [formRoot]="form">
			<div class="flex flex-col gap-3">
				<label hlmLabel>Subscription Plan</label>
				<hlm-radio-group [formField]="form.plan">
					<div class="flex items-center gap-3">
						<hlm-radio value="monthly" inputId="monthly">
							<hlm-radio-indicator indicator />
						</hlm-radio>
						<label hlmLabel for="monthly">Monthly ($9.99/month)</label>
					</div>
					<div class="flex items-center gap-3">
						<hlm-radio value="yearly" inputId="yearly">
							<hlm-radio-indicator indicator />
						</hlm-radio>
						<label hlmLabel for="yearly">Yearly ($99.99/year)</label>
					</div>
					<div class="flex items-center gap-3">
						<hlm-radio value="lifetime" inputId="lifetime">
							<hlm-radio-indicator indicator />
						</hlm-radio>
						<label hlmLabel for="lifetime">Lifetime ($299.99)</label>
					</div>
				</hlm-radio-group>
			</div>
			<button hlmBtn type="submit">Submit</button>
		</form>
	`,
})
export class RadioGroupFormPreview {
	protected readonly _model = signal({
		plan: 'monthly',
	});

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.plan, { message: 'Please select a plan' });
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
