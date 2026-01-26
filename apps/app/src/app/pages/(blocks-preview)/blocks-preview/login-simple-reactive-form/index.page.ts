import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-login-simple-reactive-form',
	imports: [HlmCardImports, HlmFieldImports, HlmInputImports, HlmButtonImports, ReactiveFormsModule, RouterLink],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div class="w-full max-w-sm">
				<hlm-card>
					<hlm-card-header>
						<h3 hlmCardTitle>Login to your account</h3>
						<p hlmCardDescription>Enter your email below to login to your account</p>
					</hlm-card-header>
					<div hlmCardContent>
						<form [formGroup]="form" (ngSubmit)="login()">
							<hlm-field-group>
								<hlm-field>
									<label hlmFieldLabel for="email">Email</label>
									<input hlmInput type="email" id="email" placeholder="you@example.com" formControlName="email" />
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
										<a
											hlmFieldDescription
											class="ml-auto inline-block text-sm underline-offset-4 hover:underline"
											routerLink="."
										>
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
			</div>
		</div>
	`,
})
export default class LoginSimpleReactiveFormPage {
	private fb = inject(FormBuilder);

	form = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(8)]],
	});

	login() {
		if (this.form.valid) {
			// login logic here
			console.log(this.form.value);
		}
	}
}
