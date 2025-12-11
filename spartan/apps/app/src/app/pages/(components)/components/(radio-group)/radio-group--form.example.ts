import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';

@Component({
	selector: 'spartan-radio-group-form',
	imports: [HlmRadioGroupImports, HlmLabelImports, HlmButtonImports, ReactiveFormsModule],
	template: `
		<form class="space-y-6" [formGroup]="form" (ngSubmit)="submit()">
			<div class="flex flex-col gap-3">
				<label hlmLabel>Subscription Plan</label>
				<hlm-radio-group formControlName="plan">
					<div class="flex items-center gap-3">
						<hlm-radio value="monthly" id="monthly">
							<hlm-radio-indicator indicator />
						</hlm-radio>
						<label hlmLabel for="monthly">Monthly ($9.99/month)</label>
					</div>
					<div class="flex items-center gap-3">
						<hlm-radio value="yearly" id="yearly">
							<hlm-radio-indicator indicator />
						</hlm-radio>
						<label hlmLabel for="yearly">Yearly ($99.99/year)</label>
					</div>
					<div class="flex items-center gap-3">
						<hlm-radio value="lifetime" id="lifetime">
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
	private readonly _formBuilder = inject(FormBuilder);
	public form = this._formBuilder.group({
		plan: ['monthly', Validators.required],
	});

	submit() {
		console.log(this.form.value);
	}
}
