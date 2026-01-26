import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	ReactiveFormsModule,
	ValidationErrors,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-signup-simple-reactive-form',
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
						<h3 hlmCardTitle>Create an account</h3>
						<p hlmCardDescription>Enter your information below to create your account</p>
					</hlm-card-header>
					<div hlmCardContent>
						<form [formGroup]="form" (ngSubmit)="signup()">
							<hlm-field-group>
								<hlm-field>
									<label hlmFieldLabel for="name">Full Name</label>
									<input hlmInput type="text" id="name" placeholder="John Doe" formControlName="name" />
									@if (form.controls.name.touched && form.controls.name.invalid) {
										<hlm-field-error>
											@if (form.controls.name.errors?.['required']) {
												Name is required.
											}
										</hlm-field-error>
									}
								</hlm-field>
								<hlm-field>
									<label hlmFieldLabel for="email">Email</label>
									<input hlmInput type="email" id="email" placeholder="you@example.com" formControlName="email" />
									@if (!(form.controls.email.touched && form.controls.email.invalid)) {
										<hlm-field-description>
											We'll use this to contact you. We will not share your email with anyone else.
										</hlm-field-description>
									}
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
									<label hlmFieldLabel for="password">Password</label>
									<input hlmInput type="password" id="password" formControlName="password" />
									@if (!(form.controls.password.touched && form.controls.password.invalid)) {
										<hlm-field-description>Must be at least 8 characters long.</hlm-field-description>
									}
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
									<label hlmFieldLabel for="confirmPassword">Confirm Password</label>
									<input hlmInput type="password" id="confirmPassword" formControlName="confirmPassword" />
									@if (
										!(
											form.controls.confirmPassword.touched &&
											(form.controls.confirmPassword.invalid || form.errors?.['passwordMismatch'])
										)
									) {
										<hlm-field-description>Please confirm your password.</hlm-field-description>
									}
									@if (
										form.controls.confirmPassword.touched &&
										(form.controls.confirmPassword.invalid || form.errors?.['passwordMismatch'])
									) {
										<hlm-field-error>
											@if (form.controls.confirmPassword.errors?.['required']) {
												Confirming your password is required.
											}
											@if (form.errors?.['passwordMismatch'] && !form.controls.confirmPassword.errors?.['required']) {
												Passwords must match.
											}
										</hlm-field-error>
									}
								</hlm-field>
								<hlm-field>
									<button hlmBtn type="submit" [disabled]="form.invalid">Create Account</button>
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
			</div>
		</div>
	`,
})
export default class SignupSimpleReactiveFormPage {
	private readonly _fb = inject(FormBuilder);

	public form = this._fb.group(
		{
			name: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(8)]],
			confirmPassword: ['', [Validators.required]],
		},
		{ validators: passwordMatch() },
	);

	public signup() {
		if (this.form.valid) {
			// signup logic here
			console.log(this.form.value);
		}
	}
}

function passwordMatch(): ValidatorFn {
	return (group: AbstractControl): ValidationErrors | null => {
		const password = group.get('password')?.value;
		const confirm = group.get('confirmPassword')?.value;
		return password === confirm ? null : { passwordMismatch: true };
	};
}
