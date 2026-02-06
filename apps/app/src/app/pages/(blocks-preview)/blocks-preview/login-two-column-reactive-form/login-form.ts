import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { remixGithubFill } from '@ng-icons/remixicon';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-two-column-login-form',
	imports: [ReactiveFormsModule, RouterLink, HlmFieldImports, HlmInputImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ remixGithubFill })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form" (ngSubmit)="login()">
			<hlm-field-group>
				<div class="flex flex-col items-center gap-1 text-center">
					<h1 class="text-2xl font-bold">Login to your account</h1>
					<p class="text-muted-foreground text-sm text-balance">Enter your email below to login to your account</p>
				</div>
				<hlm-field>
					<label hlmFieldLabel for="email">Email</label>
					<input hlmInput type="email" id="email" placeholder="m@example.com" formControlName="email" />
					@if (form.controls.email.touched && form.controls.email.invalid) {
						<hlm-field-error>
							@if (form.controls.email.errors?.['required']) {
								Email is required.
							}
							@if (form.controls.email.errors?.['email']) {
								Enter a valid email address.
							}
						</hlm-field-error>
					}
				</hlm-field>
				<hlm-field>
					<div class="flex items-center">
						<label hlmFieldLabel for="password">Password</label>
						<a hlmFieldDescription class="ml-auto text-sm underline-offset-4 hover:underline" routerLink=".">
							Forgot password?
						</a>
					</div>
					<input hlmInput type="password" id="password" formControlName="password" />
					@if (form.controls.password.touched && form.controls.password.invalid) {
						<hlm-field-error>
							@if (form.controls.password.errors?.['required']) {
								Password is required.
							}
							@if (form.controls.password.errors?.['minlength']) {
								Password must be at least 8 characters long.
							}
						</hlm-field-error>
					}
				</hlm-field>
				<hlm-field>
					<button hlmBtn type="submit" [disabled]="form.invalid">Login</button>
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
	private readonly _fb = inject(FormBuilder);

	public form = this._fb.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(8)]],
	});

	public login() {
		if (this.form.valid) {
			// login logic here
			console.log(this.form.value);
		}
	}
}
