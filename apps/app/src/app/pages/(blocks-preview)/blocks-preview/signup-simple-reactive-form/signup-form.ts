import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required, validate } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-simple-signup-form',
	imports: [FormRoot, FormField, RouterLink, HlmCardImports, HlmFieldImports, HlmInputImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Create an account</h3>
				<p hlmCardDescription>Enter your information below to create your account</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form [formRoot]="form">
					<hlm-field-group>
						<hlm-field>
							<label hlmFieldLabel for="name">Full Name</label>
							<input hlmInput type="text" id="name" placeholder="John Doe" [formField]="form.name" />
							@for (error of form.name().errors(); track error) {
								<hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
							}
						</hlm-field>
						<hlm-field>
							<label hlmFieldLabel for="email">Email</label>
							<input hlmInput type="email" id="email" placeholder="you@example.com" [formField]="form.email" />
							@if (!(form.email().touched() && form.email().invalid())) {
								<hlm-field-description>
									We'll use this to contact you. We will not share your email with anyone else.
								</hlm-field-description>
							}
							@for (error of form.email().errors(); track error) {
								<hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
							}
						</hlm-field>
						<hlm-field>
							<label hlmFieldLabel for="password">Password</label>
							<input hlmInput type="password" id="password" [formField]="form.password" />
							@if (!(form.password().touched() && form.password().invalid())) {
								<hlm-field-description>Must be at least 8 characters long.</hlm-field-description>
							}
							@for (error of form.password().errors(); track error) {
								<hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
							}
						</hlm-field>
						<hlm-field>
							<label hlmFieldLabel for="confirmPassword">Confirm Password</label>
							<input hlmInput type="password" id="confirmPassword" [formField]="form.confirmPassword" />
							@if (!(form.confirmPassword().touched() && form.confirmPassword().invalid())) {
								<hlm-field-description>Please confirm your password.</hlm-field-description>
							}
							@if (form.confirmPassword().touched() && form.confirmPassword().invalid()) {
								@for (error of form.confirmPassword().errors(); track error) {
									<hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
								}
							}
						</hlm-field>
						<hlm-field>
							<button hlmBtn type="submit" [disabled]="form().submitting()">Create Account</button>
							<button hlmBtn variant="outline" type="button">Sign up with Google</button>
							<p hlmFieldDescription class="text-center">
								Already have an account?
								<a routerLink=".">Sign in</a>
							</p>
						</hlm-field>
					</hlm-field-group>
				</form>
			</div>
		</hlm-card>
	`,
})
export class SignupForm {
	protected readonly _model = signal({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.name, { message: 'Name is required.' });
			required(schemaPath.email, { message: 'Email is required.' });
			email(schemaPath.email, { message: 'Enter a valid email address.' });
			required(schemaPath.password, { message: 'Password is required.' });
			minLength(schemaPath.password, 8, { message: 'Password must be at least 8 characters long.' });
			required(schemaPath.confirmPassword, { message: 'Confirming your password is required.' });

			validate(schemaPath.confirmPassword, ({ value, valueOf, stateOf }) => {
				if (value() === '') return null;
				if (!stateOf(schemaPath.password).touched()) return null;
				if (value() !== valueOf(schemaPath.password)) {
					return {
						kind: 'passwordMismatch',
						message: 'Passwords must match.',
					};
				}
				return null;
			});
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
