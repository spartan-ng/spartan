import { Component, signal } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { PasswordInput, passwordInputCode } from './custom-control/password-input';

@Component({
	selector: 'spartan-signal-form-custom-control-demo',
	imports: [FormRoot, FormField, HlmCardImports, HlmFieldImports, HlmInputImports, HlmButtonImports, PasswordInput],
	host: { class: 'w-full sm:max-w-md' },
	template: `
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Login to your account</h3>
				<p hlmCardDescription>Enter your email below to login to your account</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form [formRoot]="form" id="form-custom-control-demo">
					<hlm-field-group>
						<hlm-field>
							<label hlmFieldLabel for="email">Email</label>
							<input
								hlmInput
								id="email"
								placeholder="spartan@example.com"
								autoComplete="email"
								[formField]="form.email"
							/>

							@for (error of form.email().errors(); track error.kind) {
								<hlm-field-error [validator]="error.kind">
									{{ error.message }}
								</hlm-field-error>
							}
						</hlm-field>
						<hlm-field>
							<label hlmFieldLabel for="password">Password</label>
							<spartan-password-input inputId="password" [formField]="form.password" />
							@for (error of form.password().errors(); track error.kind) {
								<hlm-field-error [validator]="error.kind">
									{{ error.message }}
								</hlm-field-error>
							}
						</hlm-field>
					</hlm-field-group>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field>
					<button hlmBtn type="submit" form="form-custom-control-demo">Login</button>
					<button hlmBtn variant="outline" type="button" (click)="reset()">Reset</button>
					<hlm-field-description class="text-center">
						Don't have an account?
						<a href="#">Sign up</a>
					</hlm-field-description>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class SignalFormCustomControlDemo {
	protected readonly _model = signal({
		email: '',
		password: '',
	});

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.email, { message: 'Email is a required field.' });
			email(schemaPath.email, { message: 'Email must be a valid email address.' });
			required(schemaPath.password, { message: 'Password is a required field.' });
			minLength(schemaPath.password, 8, { message: 'Password must be at least 8 characters long.' });
		},
		{
			// triggers the submission flow by calling `submit()` - marks all fields as touched, revealing validation errors
			submission: {
				action: async () => {
					const model = this._model();

					console.log('You submitted the following values:', JSON.stringify(model, null, 2));

					// submit to api
				},
			},
		},
	);

	reset() {
		this.form().reset({
			email: '',
			password: '',
		});
	}
}

export const signalFormsCustomControlDemoCode = `
${passwordInputCode}

// login-form.ts
import { Component, signal } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { PasswordInput } from './custom-control/password-input';

@Component({
	selector: 'spartan-signal-form-custom-control-demo',
	imports: [FormRoot, FormField, HlmCardImports, HlmFieldImports, HlmInputImports, HlmButtonImports, PasswordInput],
	host: { class: 'w-full sm:max-w-md' },
	template: \`
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Login to your account</h3>
				<p hlmCardDescription>Enter your email below to login to your account</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form [formRoot]="form" id="form-custom-control-demo">
					<hlm-field-group>
						<hlm-field>
							<label hlmFieldLabel for="email">Email</label>
							<input
								hlmInput
								id="email"
								placeholder="spartan@example.com"
								autoComplete="email"
								[formField]="form.email"
							/>

							@for (error of form.email().errors(); track error.kind) {
								<hlm-field-error [validator]="error.kind">
									{{ error.message }}
								</hlm-field-error>
							}
						</hlm-field>
						<hlm-field>
							<label hlmFieldLabel for="password">Password</label>
							<spartan-password-input inputId="password" [formField]="form.password" />
							@for (error of form.password().errors(); track error.kind) {
								<hlm-field-error [validator]="error.kind">
									{{ error.message }}
								</hlm-field-error>
							}
						</hlm-field>
					</hlm-field-group>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field>
					<button hlmBtn type="submit" form="form-custom-control-demo">Login</button>
					<button hlmBtn variant="outline" type="button" (click)="reset()">Reset</button>
					<hlm-field-description class="text-center">
						Don't have an account?
						<a href="#">Sign up</a>
					</hlm-field-description>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	\`,
})
export class SignalFormCustomControlDemo {
	protected readonly _model = signal({
		email: '',
		password: '',
	});

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.email, { message: 'Email is a required field.' });
			email(schemaPath.email, { message: 'Email must be a valid email address.' });
			required(schemaPath.password, { message: 'Password is a required field.' });
			minLength(schemaPath.password, 8, { message: 'Password must be at least 8 characters long.' });
		},
		{
			// triggers the submission flow by calling \`submit()\` - marks all fields as touched, revealing validation errors
			submission: {
				action: async () => {
					const model = this._model();

					console.log('You submitted the following values:', JSON.stringify(model, null, 2));

					// submit to api
				},
			},
		},
	);

	reset() {
		this.form().reset({
			email: '',
			password: '',
		});
	}
}
`;


export const demoPasswordInputGroupCode = ``