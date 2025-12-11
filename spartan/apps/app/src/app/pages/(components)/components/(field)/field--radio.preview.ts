import { Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';

@Component({
	selector: 'spartan-field-radio-preview',
	imports: [HlmFieldImports, HlmRadioGroupImports],
	host: {
		class: 'w-full max-w-md',
	},
	template: `
		<fieldset hlmFieldSet>
			<label hlmFieldLabel>Subscription Plan</label>
			<p hlmFieldDescription>Yearly and lifetime plans offer significant savings.</p>
			<hlm-radio-group value="monthly">
				<div hlmField orientation="horizontal">
					<hlm-radio value="monthly" id="plan-monthly">
						<hlm-radio-indicator indicator />
					</hlm-radio>
					<label hlmFieldLabel for="plan-monthly" class="font-normal">Monthly ($9.99/month)</label>
				</div>
				<div hlmField orientation="horizontal">
					<hlm-radio value="yearly" id="plan-yearly">
						<hlm-radio-indicator indicator />
					</hlm-radio>
					<label hlmFieldLabel for="plan-yearly" class="font-normal">Yearly ($99.99/year)</label>
				</div>
				<div hlmField orientation="horizontal">
					<hlm-radio value="lifetime" id="plan-lifetime">
						<hlm-radio-indicator indicator />
					</hlm-radio>
					<label hlmFieldLabel for="plan-lifetime" class="font-normal">Lifetime ($299.99/lifetime)</label>
				</div>
			</hlm-radio-group>
		</fieldset>
	`,
})
export class FieldRadioPreview {}
