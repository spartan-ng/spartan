import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { remixGithubFill } from '@ng-icons/remixicon';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-two-column-login-form',
	imports: [FormRoot, FormField, RouterLink, HlmFieldImports, HlmInputImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ remixGithubFill })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formRoot]="form">
			<hlm-field-group>
				<div class="flex flex-col items-center gap-1 text-center">
					<h1 class="text-2xl font-bold">Login to your account</h1>
					<p class="text-muted-foreground text-sm text-balance">Enter your email below to login to your account</p>
				</div>
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
				</hlm-field>
				<hlm-field-separator>Or continue with</hlm-field-separator>
				<hlm-field>
					<button hlmBtn variant="outline" type="button">
						<ng-icon name="remixGithubFill" class="text-xl" />
						Login with GitHub
					</button>
					<p hlmFieldDescription class="text-center">
						Don't have an account?
						<a routerLink=".">Sign up</a>
					</p>
				</hlm-field>
			</hlm-field-group>
		</form>
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
