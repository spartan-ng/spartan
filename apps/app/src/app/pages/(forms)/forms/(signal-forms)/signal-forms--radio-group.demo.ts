import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';

@Component({
	selector: 'spartan-signal-form-radio-group-demo',
	imports: [FormField, HlmCardImports, HlmFieldImports, HlmRadioGroupImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'w-full sm:max-w-md' },
	template: `
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Subscription Plan</h3>
				<p hlmCardDescription>See pricing and features for each plan.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form novalidate id="form-radio-demo" (submit)="submit($event)">
					<fieldset hlmFieldSet>
						<legend hlmFieldLegend>Plan</legend>
						<hlm-field-description>You can upgrade or downgrade your plan at any time.</hlm-field-description>
						<hlm-radio-group [formField]="form.plan">
							@for (plan of plans; track plan.id) {
								<label hlmFieldLabel [for]="'plan-' + plan.id">
									<hlm-field orientation="horizontal">
										<hlm-field-content>
											<hlm-field-title>{{ plan.title }}</hlm-field-title>
											<hlm-field-description>{{ plan.description }}</hlm-field-description>
										</hlm-field-content>
										<hlm-radio [value]="plan.id" [inputId]="'plan-' + plan.id">
											<hlm-radio-indicator indicator />
										</hlm-radio>
									</hlm-field>
								</label>
							}
						</hlm-radio-group>

						@if (form.plan().invalid() && form.plan().touched()) {
							@for (error of form.plan().errors(); track error) {
								<hlm-field-error>
									{{ error.message }}
								</hlm-field-error>
							}
						}
					</fieldset>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field orientation="horizontal">
					<button hlmBtn variant="outline" type="button" (click)="reset()">Reset</button>
					<button hlmBtn type="submit" form="form-radio-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class SignalFormRadioGroupDemo {
	protected readonly _model = signal({
		plan: '',
	});

	public readonly form = form(this._model, (schemaPath) => {
		required(schemaPath.plan, { message: 'You must select a subscription plan to continue.' });
	});

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

	async submit(event: Event) {
		event.preventDefault();

		// marks all fields as touched, revealing validation errors
		submit(this.form, async () => {
			const model = this._model();

			console.log('You submitted the following values:', JSON.stringify(model, null, 2));
		});
	}

	reset() {
		this.form().reset({
			plan: '',
		});
	}
}

export const signalFormsRadioGroupDemoCode = `
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';

@Component({
	selector: 'spartan-signal-form-radio-group-demo',
	imports: [FormField, HlmCardImports, HlmFieldImports, HlmRadioGroupImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'w-full sm:max-w-md' },
	template: \`
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Subscription Plan</h3>
				<p hlmCardDescription>See pricing and features for each plan.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form novalidate id="form-radio-demo" (submit)="submit($event)">
					<fieldset hlmFieldSet>
						<legend hlmFieldLegend>Plan</legend>
						<hlm-field-description>You can upgrade or downgrade your plan at any time.</hlm-field-description>
						<hlm-radio-group [formField]="form.plan">
							@for (plan of plans; track plan.id) {
								<label hlmFieldLabel [for]="'plan-' + plan.id">
									<hlm-field orientation="horizontal">
										<hlm-field-content>
											<hlm-field-title>{{ plan.title }}</hlm-field-title>
											<hlm-field-description>{{ plan.description }}</hlm-field-description>
										</hlm-field-content>
										<hlm-radio [value]="plan.id" [inputId]="'plan-' + plan.id">
											<hlm-radio-indicator indicator />
										</hlm-radio>
									</hlm-field>
								</label>
							}
						</hlm-radio-group>

						@if (form.plan().invalid() && form.plan().touched()) {
							@for (error of form.plan().errors(); track error) {
								<hlm-field-error>
									{{ error.message }}
								</hlm-field-error>
							}
						}
					</fieldset>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field orientation="horizontal">
					<button hlmBtn variant="outline" type="button" (click)="reset()">Reset</button>
					<button hlmBtn type="submit" form="form-radio-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	\`,
})
export class SignalFormRadioGroupDemo {
	protected readonly _model = signal({
		plan: '',
	});

	public readonly form = form(this._model, (schemaPath) => {
		required(schemaPath.plan, { message: 'You must select a subscription plan to continue.' });
	});

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

	async submit(event: Event) {
		event.preventDefault();

		// marks all fields as touched, revealing validation errors
		submit(this.form, async () => {
			const model = this._model();

			console.log('You submitted the following values:', JSON.stringify(model, null, 2));
		});
	}

	reset() {
		this.form().reset({
			plan: '',
		});
	}
}
`;
