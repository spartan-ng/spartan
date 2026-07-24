import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';

@Component({
	selector: 'spartan-signal-form-switch-demo',
	imports: [FormField, HlmCardImports, HlmFieldImports, HlmSwitchImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'w-full sm:max-w-md' },
	template: `
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Security Settings</h3>
				<p hlmCardDescription>Manage your account security preferences.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form novalidate id="form-switch-demo" (submit)="submit($event)">
					<hlm-field-group>
						<hlm-field orientation="horizontal">
							<hlm-field-content>
								<label hlmFieldLabel for="two-factor">Multi-factor authentication</label>
								<hlm-field-description>
									Enable multi-factor authentication to secure your account.
								</hlm-field-description>
								@for (error of form.twoFactor().errors(); track error) {
									<hlm-field-error [validator]="error.kind">
										{{ error.message }}
									</hlm-field-error>
								}
							</hlm-field-content>
							<hlm-switch inputId="two-factor" [formField]="form.twoFactor" />
						</hlm-field>
					</hlm-field-group>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field orientation="horizontal">
					<button hlmBtn variant="outline" type="button" (click)="reset()">Reset</button>
					<button hlmBtn type="submit" form="form-switch-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class SignalFormSwitchDemo {
	protected readonly _model = signal({
		twoFactor: false,
	});

	public readonly form = form(this._model, (schemaPath) => {
		required(schemaPath.twoFactor, {
			message: 'It is highly recommended to enable two-factor authentication.',
		});
	});

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
			twoFactor: false,
		});
	}
}

export const signalFormsSwitchDemoCode = `
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';

@Component({
	selector: 'spartan-signal-form-switch-demo',
	imports: [FormField, HlmCardImports, HlmFieldImports, HlmSwitchImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'w-full sm:max-w-md' },
	template: \`
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Security Settings</h3>
				<p hlmCardDescription>Manage your account security preferences.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form novalidate id="form-switch-demo" (submit)="submit($event)">
					<hlm-field-group>
						<hlm-field orientation="horizontal">
							<hlm-field-content>
								<label hlmFieldLabel for="two-factor">Multi-factor authentication</label>
								<hlm-field-description>
									Enable multi-factor authentication to secure your account.
								</hlm-field-description>
								@for (error of form.twoFactor().errors(); track error) {
									<hlm-field-error [validator]="error.kind">
										{{ error.message }}
									</hlm-field-error>
								}
							</hlm-field-content>
							<hlm-switch inputId="two-factor" [formField]="form.twoFactor" />
						</hlm-field>
					</hlm-field-group>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field orientation="horizontal">
					<button hlmBtn variant="outline" type="button" (click)="reset()">Reset</button>
					<button hlmBtn type="submit" form="form-switch-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	\`,
})
export class SignalFormSwitchDemo {
	protected readonly _model = signal({
		twoFactor: false,
	});

	public readonly form = form(this._model, (schemaPath) => {
		required(schemaPath.twoFactor, {
			message: 'It is highly recommended to enable two-factor authentication.',
		});
	});

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
			twoFactor: false,
		});
	}
}
`;
