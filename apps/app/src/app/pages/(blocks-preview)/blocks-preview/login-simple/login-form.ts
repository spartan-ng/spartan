import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-simple-login-form',
	imports: [FormRoot, FormField, RouterLink, HlmCardImports, HlmFieldImports, HlmInputImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Login to your account</h3>
				<p hlmCardDescription>Enter your email below to login to your account</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form [formRoot]="form">
					<hlm-field-group>
						<hlm-field>
							<label hlmFieldLabel for="email">Email</label>
							<input hlmInput type="email" id="email" placeholder="m@example.com" [formField]="form.email" />
							@for (error of form.email().errors(); track error) {
								<hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
							}
						</hlm-field>
						<hlm-field>
							<div class="flex items-center">
								<label hlmFieldLabel for="password">Password</label>
								<a hlmFieldDescription class="ml-auto text-sm underline-offset-4 hover:underline" routerLink=".">
									Forgot password?
								</a>
							</div>
							<input hlmInput type="password" id="password" [formField]="form.password" />
							@for (error of form.password().errors(); track error) {
								<hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
							}
						</hlm-field>
						<hlm-field>
							<button hlmBtn type="submit" [disabled]="form().submitting()">Login</button>
							<button hlmBtn variant="outline" type="button">Login with Google</button>
							<p hlmFieldDescription class="text-center">
								Don't have an account?
								<a routerLink=".">Sign up</a>
							</p>
						</hlm-field>
					</hlm-field-group>
				</form>
			</div>
		</hlm-card>
	`,
})
export class LoginForm {
	protected readonly _model = signal({
		email: '',
		password: '',
	});

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.email, { message: 'Email is required.' });
			email(schemaPath.email, { message: 'Enter a valid email address.' });
			required(schemaPath.password, { message: 'Password is required.' });
			minLength(schemaPath.password, 8, { message: 'Password must be at least 8 characters long.' });
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
