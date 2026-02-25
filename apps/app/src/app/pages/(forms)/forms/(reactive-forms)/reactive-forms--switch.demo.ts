import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';

@Component({
	selector: 'spartan-reactive-form-switch-demo',
	imports: [ReactiveFormsModule, HlmCardImports, HlmFieldImports, HlmSwitchImports, HlmButtonImports],
	host: { class: 'w-full sm:max-w-md' },
	template: `
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Security Settings</h3>
				<p hlmCardDescription>Manage your account security preferences.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form id="form-switch-demo" [formGroup]="form" (ngSubmit)="submit()">
					<hlm-field-group>
						<hlm-field orientation="horizontal">
							<hlm-field-content>
								<label hlmFieldLabel for="two-factor">Multi-factor authentication</label>
								<hlm-field-description>
									Enable multi-factor authentication to secure your account.
								</hlm-field-description>
								@if (form.controls.twoFactor.invalid && form.controls.twoFactor.touched) {
									<hlm-field-error>It is highly recommended to enable two-factor authentication.</hlm-field-error>
								}
							</hlm-field-content>
							<hlm-switch id="two-factor" formControlName="twoFactor" />
						</hlm-field>
					</hlm-field-group>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field orientation="horizontal">
					<button hlmBtn variant="outline" type="button" (click)="form.reset({ twoFactor: false })">Reset</button>
					<button hlmBtn type="submit" form="form-switch-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class ReactiveFormSwitchDemo {
	private readonly _fb = inject(FormBuilder);

	public form = this._fb.group({
		twoFactor: [false, Validators.requiredTrue],
	});

	submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		console.log('You submitted the following values:', JSON.stringify(this.form.value, null, 2));
	}
}

export const reactiveFormsSwitchDemoCode = `
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';

@Component({
	selector: 'spartan-reactive-form-switch-demo',
	imports: [ReactiveFormsModule, HlmCardImports, HlmFieldImports, HlmSwitchImports, HlmButtonImports],
	host: { class: 'w-full sm:max-w-md' },
	template: \`
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Security Settings</h3>
				<p hlmCardDescription>Manage your account security preferences.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form id="form-switch-demo" [formGroup]="form" (ngSubmit)="submit()">
					<hlm-field-group>
						<hlm-field orientation="horizontal">
							<hlm-field-content>
								<label hlmFieldLabel for="two-factor">Multi-factor authentication</label>
								<hlm-field-description>
									Enable multi-factor authentication to secure your account.
								</hlm-field-description>
								@if (form.controls.twoFactor.invalid && form.controls.twoFactor.touched) {
									<hlm-field-error>It is highly recommended to enable two-factor authentication.</hlm-field-error>
								}
							</hlm-field-content>
							<hlm-switch id="two-factor" formControlName="twoFactor" />
						</hlm-field>
					</hlm-field-group>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field orientation="horizontal">
					<button hlmBtn variant="outline" type="button" (click)="form.reset({ twoFactor: false })">Reset</button>
					<button hlmBtn type="submit" form="form-switch-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	\`,
})
export class ReactiveFormSwitchDemo {
	private readonly _fb = inject(FormBuilder);

	public form = this._fb.group({
		twoFactor: [false, Validators.requiredTrue],
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
