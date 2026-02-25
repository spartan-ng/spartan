import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
	selector: 'spartan-bug-report-form',
	imports: [
		ReactiveFormsModule,
		HlmCardImports,
		HlmFieldImports,
		HlmInputImports,
		HlmInputGroupImports,
		HlmButtonImports,
	],
	host: { class: 'w-full sm:max-w-md' },
	template: `
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Bug Report</h3>
				<p hlmCardDescription>Help us improve by reporting bugs you encounter.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form id="form-bug-report" [formGroup]="form" (ngSubmit)="submit()">
					<hlm-field-group>
						<hlm-field>
							<label hlmFieldLabel for="title">Bug Title</label>
							<input
								hlmInput
								id="title"
								placeholder="Login button not working on mobile"
								autoComplete="off"
								formControlName="title"
							/>
							@if (form.controls.title.touched && form.controls.title.invalid) {
								<hlm-field-error>
									@if (form.controls.title.errors?.['required'] || form.controls.title.errors?.['minlength']) {
										Title must be at least 5 characters.
									}
									@if (form.controls.title.errors?.['maxlength']) {
										Title cannot exceed 32 characters.
									}
								</hlm-field-error>
							}
						</hlm-field>
						<hlm-field>
							<label hlmFieldLabel for="description">Description</label>
							<hlm-input-group>
								<textarea
									hlmInputGroupTextarea
									id="description"
									class="min-h-24"
									placeholder="I'm having an issue with the login button on mobile."
									rows="6"
									formControlName="description"
								></textarea>
								<hlm-input-group-addon align="block-end">
									<span hlmInputGroupText>{{ form.controls.description.value?.length || 0 }}/100 characters</span>
								</hlm-input-group-addon>
							</hlm-input-group>
							<hlm-field-description>
								Include steps to reproduce, expected behavior, and what actually happened.
							</hlm-field-description>
							@if (form.controls.description.touched && form.controls.description.invalid) {
								<hlm-field-error>
									@if (
										form.controls.description.errors?.['required'] || form.controls.description.errors?.['minlength']
									) {
										Description must be at least 20 characters.
									}
									@if (form.controls.description.errors?.['maxlength']) {
										Description cannot exceed 100 characters.
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
					<button hlmBtn type="submit" form="form-bug-report">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class BugReportForm {
	private readonly _fb = inject(FormBuilder);

	public form = this._fb.group({
		title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]],
		description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(100)]],
	});

	submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		console.log('You submitted the following values:', JSON.stringify(this.form.value, null, 2));
	}
}

export const demoCode = `
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
	selector: 'spartan-reactive-forms-demo',
	imports: [
		ReactiveFormsModule,
		HlmCardImports,
		HlmFieldImports,
		HlmInputImports,
		HlmInputGroupImports,
		HlmButtonImports,
	],
	host: { class: 'w-full sm:max-w-md' },
	template: \`
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Bug Report</h3>
				<p hlmCardDescription>Help us improve by reporting bugs you encounter.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form id="form-bug-report" [formGroup]="form" (ngSubmit)="submit()">
					<hlm-field-group>
						<hlm-field>
							<label hlmFieldLabel for="title">Bug Title</label>
							<input
								hlmInput
								id="title"
								placeholder="Login button not working on mobile"
								autoComplete="off"
								formControlName="title"
							/>
							@if (form.controls.title.touched && form.controls.title.invalid) {
								<hlm-field-error>
									@if (form.controls.title.errors?.['required'] || form.controls.title.errors?.['minlength']) {
										Title must be at least 5 characters.
									}
									@if (form.controls.title.errors?.['maxlength']) {
										Title cannot exceed 32 characters.
									}
								</hlm-field-error>
							}
						</hlm-field>
						<hlm-field>
							<label hlmFieldLabel for="description">Description</label>
							<hlm-input-group>
								<textarea
									hlmInputGroupTextarea
									id="description"
									class="min-h-24"
									placeholder="I'm having an issue with the login button on mobile."
									rows="6"
									formControlName="description"
								></textarea>
								<hlm-input-group-addon align="block-end">
									<span hlmInputGroupText>{{ form.controls.description.value?.length || 0 }}/100 characters</span>
								</hlm-input-group-addon>
							</hlm-input-group>
							<hlm-field-description>
								Include steps to reproduce, expected behavior, and what actually happened.
							</hlm-field-description>
							@if (form.controls.description.touched && form.controls.description.invalid) {
								<hlm-field-error>
									@if (
										form.controls.description.errors?.['required'] || form.controls.description.errors?.['minlength']
									) {
										Description must be at least 20 characters.
									}
									@if (form.controls.description.errors?.['maxlength']) {
										Description cannot exceed 100 characters.
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
					<button hlmBtn type="submit" form="form-bug-report">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	\`,
})
export class ReactiveFormsDemo {
	private readonly _fb = inject(FormBuilder);

	public form = this._fb.group({
		title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]],
		description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(100)]],
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

export const demoAnatomyCode = `
<hlm-field>
	<label hlmFieldLabel for="title">Bug Title</label>
	<input
		hlmInput
		id="title"
		placeholder="Login button not working on mobile"
		autoComplete="off"
		formControlName="title"
	/>
	@if (form.controls.title.touched && form.controls.title.invalid) {
		<hlm-field-error>
			@if (form.controls.title.errors?.['required'] || form.controls.title.errors?.['minlength']) {
				Title must be at least 5 characters.
			}
			@if (form.controls.title.errors?.['maxlength']) {
				Title cannot exceed 32 characters.
			}
		</hlm-field-error>
	}
</hlm-field>`;

export const demoFormSchemaCode = `
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'bug-report-form',
	imports: [],
	host: { class: 'w-full sm:max-w-md' },
	template: \`...\`,
})
export class BugReportForm {
	private readonly _fb = inject(FormBuilder);

	public form = this._fb.group({
		title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]],
		description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(100)]],
	});
}
`;

export const demoSetupForm = `
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'bug-report-form',
	imports: [ReactiveFormsModule],
	host: { class: 'w-full sm:max-w-md' },
	template: \`
		<form [formGroup]="form" (ngSubmit)="submit()">
			<!-- Build the form here -->
		</form>
	\`,
})
export class BugReportForm {
	private readonly _fb = inject(FormBuilder);

	public form = this._fb.group({
		title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]],
		description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(100)]],
	});

	submit() {
		// Do something with the form values.
		console.log(this.form.value);
	}
}
`;

export const demoResetForm = `
<button hlmBtn variant="outline" type="button" (click)="form.reset()">
	Reset
</button>
`;
