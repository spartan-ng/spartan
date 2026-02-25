import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-reactive-form-input-demo',
	imports: [ReactiveFormsModule, HlmCardImports, HlmFieldImports, HlmInputImports, HlmButtonImports],
	host: { class: 'w-full sm:max-w-md' },
	template: `
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Profile Settings</h3>
				<p hlmCardDescription>Update your profile information below.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form id="form-input-demo" [formGroup]="form" (ngSubmit)="submit()">
					<hlm-field-group>
						<hlm-field>
							<label hlmFieldLabel for="username">Username</label>
							<input hlmInput id="username" placeholder="spartan" autoComplete="username" formControlName="username" />
							<hlm-field-description>
								This is your public display name. Must be between 3 and 10 characters. Must only contain letters,
								numbers, and underscores.
							</hlm-field-description>
							@if (form.controls.username.touched && form.controls.username.invalid) {
								<hlm-field-error>
									@if (form.controls.username.errors?.['required'] || form.controls.username.errors?.['minlength']) {
										Username must be at least 3 characters.
									} @else if (form.controls.username.errors?.['maxlength']) {
										Username must be at most 10 characters.
									} @else if (form.controls.username.errors?.['pattern']) {
										Username can only contain letters, numbers, and underscores.
									}
								</hlm-field-error>
							}
						</hlm-field>
					</hlm-field-group>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field orientation="horizontal">
					<button hlmBtn variant="outline" type="button" (click)="form.reset()">Reset</button>
					<button hlmBtn type="submit" form="form-input-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class ReactiveFormInputDemo {
	private readonly _fb = inject(FormBuilder);

	public form = this._fb.group({
		username: [
			'',
			[Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern(/^[a-zA-Z0-9_]+$/)],
		],
	});

	submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		console.log('You submitted the following values:', JSON.stringify(this.form.value, null, 2));
	}
}

export const reactiveFormsInputDemoCode = `
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-reactive-form-input-demo',
	imports: [ReactiveFormsModule, HlmCardImports, HlmFieldImports, HlmInputImports, HlmButtonImports],
	host: { class: 'w-full sm:max-w-md' },
	template: \`
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Profile Settings</h3>
				<p hlmCardDescription>Update your profile information below.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form id="form-input-demo" [formGroup]="form" (ngSubmit)="submit()">
					<hlm-field-group>
						<hlm-field>
							<label hlmFieldLabel for="username">Username</label>
							<input hlmInput id="username" placeholder="spartan" autoComplete="username" formControlName="username" />
							<hlm-field-description>
								This is your public display name. Must be between 3 and 10 characters. Must only contain letters,
								numbers, and underscores.
							</hlm-field-description>
							@if (form.controls.username.touched && form.controls.username.invalid) {
								<hlm-field-error>
									@if (form.controls.username.errors?.['required'] || form.controls.username.errors?.['minlength']) {
										Username must be at least 3 characters.
									} @else if (form.controls.username.errors?.['maxlength']) {
										Username must be at most 10 characters.
									} @else if (form.controls.username.errors?.['pattern']) {
										Username can only contain letters, numbers, and underscores.
									}
								</hlm-field-error>
							}
						</hlm-field>
					</hlm-field-group>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field orientation="horizontal">
					<button hlmBtn variant="outline" type="button" (click)="form.reset()">Reset</button>
					<button hlmBtn type="submit" form="form-input-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	\`,
})
export class ReactiveFormInputDemo {
	private readonly _fb = inject(FormBuilder);

	public form = this._fb.group({
		username: [
			'',
			[Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern(/^[a-zA-Z0-9_]+$/)],
		],
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
