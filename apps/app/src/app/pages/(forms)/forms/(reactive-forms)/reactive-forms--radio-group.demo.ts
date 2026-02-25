import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';

@Component({
	selector: 'spartan-reactive-form-radio-group-demo',
	imports: [ReactiveFormsModule, HlmCardImports, HlmFieldImports, HlmRadioGroupImports, HlmButtonImports],
	host: { class: 'w-full sm:max-w-md' },
	template: `
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Subscription Plan</h3>
				<p hlmCardDescription>See pricing and features for each plan.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form id="form-radio-group-demo" [formGroup]="form" (ngSubmit)="submit()">
					<hlm-field-group>
						<fieldset hlmFieldSet>
							<legend hlmFieldLegend>Plan</legend>
							<hlm-field-description>You can upgrade or downgrade your plan at any time.</hlm-field-description>
							<hlm-radio-group formControlName="plan">
								@for (plan of plans; track plan.id) {
									<label hlmFieldLabel [for]="'plan-' + plan.id">
										<hlm-field orientation="horizontal">
											<hlm-field-content>
												<hlm-field-title>{{ plan.title }}</hlm-field-title>
												<hlm-field-description>{{ plan.description }}</hlm-field-description>
											</hlm-field-content>
											<hlm-radio [value]="plan.id" [id]="'plan-' + plan.id">
												<hlm-radio-indicator indicator />
											</hlm-radio>
										</hlm-field>
									</label>
								}
							</hlm-radio-group>
							@if (form.controls.plan.invalid && form.controls.plan.touched) {
								<hlm-field-error>You must select a subscription plan to continue.</hlm-field-error>
							}
						</fieldset>
					</hlm-field-group>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field orientation="horizontal">
					<button hlmBtn variant="outline" type="button" (click)="form.reset()">Reset</button>
					<button hlmBtn type="submit" form="form-radio-group-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class ReactiveFormRadioGroupDemo {
	private readonly _fb = inject(FormBuilder);

	public plans = [
		{
			id: 'starter',
			title: 'Starter (100K tokens/month)',
			description: 'For everyday use with basic features.',
		},
		{
			id: 'pro',
			title: 'Pro (1M tokens/month)',
			description: 'For advanced AI usage with more features.',
		},
		{
			id: 'enterprise',
			title: 'Enterprise (Unlimited tokens)',
			description: 'For large teams and heavy usage.',
		},
	];

	public form = this._fb.group({
		plan: ['', Validators.required],
	});

	submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		console.log('You submitted the following values:', JSON.stringify(this.form.value, null, 2));
	}
}

export const reactiveFormsRadioGroupDemoCode = `
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';

@Component({
	selector: 'spartan-reactive-form-radio-group-demo',
	imports: [ReactiveFormsModule, HlmCardImports, HlmFieldImports, HlmRadioGroupImports, HlmButtonImports],
	host: { class: 'w-full sm:max-w-md' },
	template: \`
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Subscription Plan</h3>
				<p hlmCardDescription>See pricing and features for each plan.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form id="form-radio-group-demo" [formGroup]="form" (ngSubmit)="submit()">
					<hlm-field-group>
						<fieldset hlmFieldSet>
							<legend hlmFieldLegend>Plan</legend>
							<hlm-field-description>You can upgrade or downgrade your plan at any time.</hlm-field-description>
							<hlm-radio-group formControlName="plan">
								@for (plan of plans; track plan.id) {
									<label hlmFieldLabel [for]="'plan-' + plan.id">
										<hlm-field orientation="horizontal">
											<hlm-field-content>
												<hlm-field-title>{{ plan.title }}</hlm-field-title>
												<hlm-field-description>{{ plan.description }}</hlm-field-description>
											</hlm-field-content>
											<hlm-radio [value]="plan.id" [id]="'plan-' + plan.id">
												<hlm-radio-indicator indicator />
											</hlm-radio>
										</hlm-field>
									</label>
								}
							</hlm-radio-group>
							@if (form.controls.plan.invalid && form.controls.plan.touched) {
								<hlm-field-error>You must select a subscription plan to continue.</hlm-field-error>
							}
						</fieldset>
					</hlm-field-group>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field orientation="horizontal">
					<button hlmBtn variant="outline" type="button" (click)="form.reset()">Reset</button>
					<button hlmBtn type="submit" form="form-radio-group-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	\`,
})
export class ReactiveFormRadioGroupDemo {
	private readonly _fb = inject(FormBuilder);

	public plans = [
		{
			id: 'starter',
			title: 'Starter (100K tokens/month)',
			description: 'For everyday use with basic features.',
		},
		{
			id: 'pro',
			title: 'Pro (1M tokens/month)',
			description: 'For advanced AI usage with more features.',
		},
		{
			id: 'enterprise',
			title: 'Enterprise (Unlimited tokens)',
			description: 'For large teams and heavy usage.',
		},
	];

	public form = this._fb.group({
		plan: ['', Validators.required],
	});

	submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		console.log('You submitted the following values:', JSON.stringify(this.form.value, null, 2));
	}
}
`;
