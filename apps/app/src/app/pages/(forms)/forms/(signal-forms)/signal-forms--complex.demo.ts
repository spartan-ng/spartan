import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, minLength, required, submit } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';

@Component({
	selector: 'spartan-signal-form-complex-demo',
	imports: [
		FormField,
		HlmCardImports,
		HlmFieldImports,
		HlmRadioGroupImports,
		HlmCheckboxImports,
		HlmSelectImports,
		HlmSwitchImports,
		HlmButtonImports,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'w-full sm:max-w-md' },
	template: `
		<hlm-card>
			<hlm-card-header class="border-b">
				<h3 hlmCardTitle>You're almost there!</h3>
				<p hlmCardDescription>Choose your subscription plan and billing period.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form novalidate id="form-complex-demo" (submit)="submit($event)">
					<hlm-field-group>
						<fieldset hlmFieldSet>
							<legend hlmFieldLegend variant="label">Subscription Plan</legend>
							<hlm-field-description>Choose your subscription plan.</hlm-field-description>
							<hlm-radio-group [formField]="form.plan">
								@for (plan of plans; track plan.id) {
									<label hlmFieldLabel [for]="'complex-plan-' + plan.id">
										<hlm-field orientation="horizontal">
											<hlm-field-content>
												<hlm-field-title>{{ plan.title }}</hlm-field-title>
												<hlm-field-description>{{ plan.description }}</hlm-field-description>
											</hlm-field-content>
											<hlm-radio [value]="plan.id" [inputId]="'complex-plan-' + plan.id">
												<hlm-radio-indicator indicator />
											</hlm-radio>
										</hlm-field>
									</label>
								}
							</hlm-radio-group>
						</fieldset>
						<hlm-field-separator />
						<hlm-field>
							<label hlmFieldLabel>Billing Period</label>
							<hlm-select [formField]="form.billingPeriod" [itemToString]="itemToString">
								<hlm-select-trigger buttonId="billingPeriod" class="w-full">
									<hlm-select-value placeholder="Select" />
								</hlm-select-trigger>
								<hlm-select-content *hlmSelectPortal>
									<hlm-select-group>
										@for (billingPeriod of billingPeriods; track $index) {
											<hlm-select-item [value]="billingPeriod.value">
												{{ billingPeriod.label }}
											</hlm-select-item>
										}
									</hlm-select-group>
								</hlm-select-content>
							</hlm-select>
							<hlm-field-description>Choose how often you want to be billed.</hlm-field-description>
							@for (error of form.billingPeriod().errors(); track error) {
								<hlm-field-error [validator]="error.kind">
									{{ error.message }}
								</hlm-field-error>
							}
						</hlm-field>
						<hlm-field-separator />
						<fieldset hlmFieldSet>
							<legend hlmFieldLegend variant="label">Add-ons</legend>
							<hlm-field-description>Select additional features you'd like to include.</hlm-field-description>
							<hlm-field-group data-slot="checkbox-group">
								@for (addon of addons; track addon.id) {
									<hlm-field
										orientation="horizontal"
										[forceInvalid]="form.addons().invalid() && form.addons().touched()"
									>
										<hlm-checkbox
											[inputId]="'addon-' + addon.id"
											[forceInvalid]="form.addons().invalid() && form.addons().touched()"
											[checked]="form.addons().value().includes(addon.id)"
											(checkedChange)="handleChange($event, addon.id)"
										/>
										<hlm-field-content>
											<label hlmFieldLabel class="font-normal" [for]="'addon-' + addon.id">
												{{ addon.title }}
											</label>
											<hlm-field-description>{{ addon.description }}</hlm-field-description>
										</hlm-field-content>
									</hlm-field>
								}
							</hlm-field-group>
							@if (form.addons().invalid() && form.addons().touched()) {
								@for (error of form.addons().errors(); track error) {
									<hlm-field-error>{{ error.message }}</hlm-field-error>
								}
							}
						</fieldset>
						<hlm-field-separator />
						<hlm-field orientation="horizontal">
							<hlm-field-content>
								<label hlmFieldLabel for="email-notifications">Email Notifications</label>
								<hlm-field-description>Receive email updates about your subscription</hlm-field-description>
								@for (error of form.emailNotifications().errors(); track error) {
									<hlm-field-error [validator]="error.kind">
										{{ error.message }}
									</hlm-field-error>
								}
							</hlm-field-content>
							<hlm-switch inputId="email-notifications" [formField]="form.emailNotifications" />
						</hlm-field>
					</hlm-field-group>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field>
					<button hlmBtn type="submit" form="form-complex-demo">Save preferences</button>
					<button hlmBtn variant="outline" type="button" (click)="reset()">Reset</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class SignalFormComplexDemo {
	protected readonly _model = signal<{
		plan: string;
		billingPeriod: string | null;
		addons: string[];
		emailNotifications: boolean;
	}>({
		plan: 'basic',
		billingPeriod: null,
		addons: [],
		emailNotifications: false,
	});

	public readonly form = form(this._model, (schemaPath) => {
		required(schemaPath.plan, { message: 'Please select a subscription plan' });
		required(schemaPath.billingPeriod, { message: 'Please select a billing period' });
		minLength(schemaPath.addons, 1, { message: 'Please select at least one add-on' });
	});

	public plans = [
		{
			id: 'basic',
			title: 'Basic',
			description: 'For individuals and small teams',
		},
		{
			id: 'pro',
			title: 'Pro',
			description: 'For businesses with higher demands',
		},
	];

	public billingPeriods = [
		{ label: 'Monthly', value: 'monthly' },
		{ label: 'Yearly', value: 'yearly' },
	];

	public itemToString = (value: string) => this.billingPeriods.find((period) => period.value === value)?.label ?? '';

	public addons = [
		{
			id: 'analytics',
			title: 'Analytics',
			description: 'Advanced analytics and reporting',
		},
		{
			id: 'backup',
			title: 'Backup',
			description: 'Automated daily backups',
		},
		{
			id: 'support',
			title: 'Priority Support',
			description: '24/7 premium customer support',
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

	handleChange(checked: boolean, id: string) {
		if (checked) {
			this.form.addons().value.update((addons) => [...addons, id]);
		} else {
			this.form.addons().value.update((addons) => addons.filter((addonId) => addonId !== id));
		}

		this.form.addons().markAsTouched();
	}

	reset() {
		this.form().reset({
			plan: 'basic',
			billingPeriod: null,
			addons: [],
			emailNotifications: false,
		});
	}
}

export const signalFormsComplexDemoCode = `
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, minLength, required, submit } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';

@Component({
	selector: 'spartan-signal-form-complex-demo',
	imports: [
		FormField,
		HlmCardImports,
		HlmFieldImports,
		HlmRadioGroupImports,
		HlmCheckboxImports,
		HlmSelectImports,
		HlmSwitchImports,
		HlmButtonImports,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'w-full sm:max-w-md' },
	template: \`
		<hlm-card>
			<hlm-card-header class="border-b">
				<h3 hlmCardTitle>You're almost there!</h3>
				<p hlmCardDescription>Choose your subscription plan and billing period.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form novalidate id="form-complex-demo" (submit)="submit($event)">
					<hlm-field-group>
						<fieldset hlmFieldSet>
							<legend hlmFieldLegend variant="label">Subscription Plan</legend>
							<hlm-field-description>Choose your subscription plan.</hlm-field-description>
							<hlm-radio-group [formField]="form.plan">
								@for (plan of plans; track plan.id) {
									<label hlmFieldLabel [for]="'complex-plan-' + plan.id">
										<hlm-field orientation="horizontal">
											<hlm-field-content>
												<hlm-field-title>{{ plan.title }}</hlm-field-title>
												<hlm-field-description>{{ plan.description }}</hlm-field-description>
											</hlm-field-content>
											<hlm-radio [value]="plan.id" [inputId]="'complex-plan-' + plan.id">
												<hlm-radio-indicator indicator />
											</hlm-radio>
										</hlm-field>
									</label>
								}
							</hlm-radio-group>
						</fieldset>
						<hlm-field-separator />
						<hlm-field>
							<label hlmFieldLabel>Billing Period</label>
							<hlm-select [formField]="form.billingPeriod" [itemToString]="itemToString">
								<hlm-select-trigger buttonId="billingPeriod" class="w-full">
									<hlm-select-value placeholder="Select" />
								</hlm-select-trigger>
								<hlm-select-content *hlmSelectPortal>
									<hlm-select-group>
										@for (billingPeriod of billingPeriods; track $index) {
											<hlm-select-item [value]="billingPeriod.value">
												{{ billingPeriod.label }}
											</hlm-select-item>
										}
									</hlm-select-group>
								</hlm-select-content>
							</hlm-select>
							<hlm-field-description>Choose how often you want to be billed.</hlm-field-description>
							@for (error of form.billingPeriod().errors(); track error) {
								<hlm-field-error [validator]="error.kind">
									{{ error.message }}
								</hlm-field-error>
							}
						</hlm-field>
						<hlm-field-separator />
						<fieldset hlmFieldSet>
							<legend hlmFieldLegend variant="label">Add-ons</legend>
							<hlm-field-description>Select additional features you'd like to include.</hlm-field-description>
							<hlm-field-group data-slot="checkbox-group">
								@for (addon of addons; track addon.id) {
									<hlm-field
										orientation="horizontal"
										[forceInvalid]="form.addons().invalid() && form.addons().touched()"
									>
										<hlm-checkbox
											[inputId]="'addon-' + addon.id"
											[forceInvalid]="form.addons().invalid() && form.addons().touched()"
											[checked]="form.addons().value().includes(addon.id)"
											(checkedChange)="handleChange($event, addon.id)"
										/>
										<hlm-field-content>
											<label hlmFieldLabel class="font-normal" [for]="'addon-' + addon.id">
												{{ addon.title }}
											</label>
											<hlm-field-description>{{ addon.description }}</hlm-field-description>
										</hlm-field-content>
									</hlm-field>
								}
							</hlm-field-group>
							@if (form.addons().invalid() && form.addons().touched()) {
								@for (error of form.addons().errors(); track error) {
									<hlm-field-error>{{ error.message }}</hlm-field-error>
								}
							}
						</fieldset>
						<hlm-field-separator />
						<hlm-field orientation="horizontal">
							<hlm-field-content>
								<label hlmFieldLabel for="email-notifications">Email Notifications</label>
								<hlm-field-description>Receive email updates about your subscription</hlm-field-description>
								@for (error of form.emailNotifications().errors(); track error) {
									<hlm-field-error [validator]="error.kind">
										{{ error.message }}
									</hlm-field-error>
								}
							</hlm-field-content>
							<hlm-switch inputId="email-notifications" [formField]="form.emailNotifications" />
						</hlm-field>
					</hlm-field-group>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field>
					<button hlmBtn type="submit" form="form-complex-demo">Save preferences</button>
					<button hlmBtn variant="outline" type="button" (click)="reset()">Reset</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	\`,
})
export class SignalFormComplexDemo {
	protected readonly _model = signal<{
		plan: string;
		billingPeriod: string | null;
		addons: string[];
		emailNotifications: boolean;
	}>({
		plan: 'basic',
		billingPeriod: null,
		addons: [],
		emailNotifications: false,
	});

	public readonly form = form(this._model, (schemaPath) => {
		required(schemaPath.plan, { message: 'Please select a subscription plan' });
		required(schemaPath.billingPeriod, { message: 'Please select a billing period' });
		minLength(schemaPath.addons, 1, { message: 'Please select at least one add-on' });
	});

	public plans = [
		{
			id: 'basic',
			title: 'Basic',
			description: 'For individuals and small teams',
		},
		{
			id: 'pro',
			title: 'Pro',
			description: 'For businesses with higher demands',
		},
	];

	public billingPeriods = [
		{ label: 'Monthly', value: 'monthly' },
		{ label: 'Yearly', value: 'yearly' },
	];

	public itemToString = (value: string) => this.billingPeriods.find((period) => period.value === value)?.label ?? '';

	public addons = [
		{
			id: 'analytics',
			title: 'Analytics',
			description: 'Advanced analytics and reporting',
		},
		{
			id: 'backup',
			title: 'Backup',
			description: 'Automated daily backups',
		},
		{
			id: 'support',
			title: 'Priority Support',
			description: '24/7 premium customer support',
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

	handleChange(checked: boolean, id: string) {
		if (checked) {
			this.form.addons().value.update((addons) => [...addons, id]);
		} else {
			this.form.addons().value.update((addons) => addons.filter((addonId) => addonId !== id));
		}

		this.form.addons().markAsTouched();
	}

	reset() {
		this.form().reset({
			plan: 'basic',
			billingPeriod: null,
			addons: [],
			emailNotifications: false,
		});
	}
}
`;
