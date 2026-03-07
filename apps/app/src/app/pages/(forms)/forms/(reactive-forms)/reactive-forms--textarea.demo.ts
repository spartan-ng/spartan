import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-reactive-form-textarea-demo',
	imports: [ReactiveFormsModule, HlmCardImports, HlmFieldImports, HlmTextareaImports, HlmButtonImports],
	host: { class: 'w-full sm:max-w-md' },
	template: `
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Personalization</h3>
				<p hlmCardDescription>Customize your experience by telling us more about yourself.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form id="form-textarea-demo" [formGroup]="form" (ngSubmit)="submit()">
					<hlm-field-group>
						<hlm-field>
							<label hlmFieldLabel for="about">More about you</label>
							<textarea
								hlmTextarea
								id="about"
								class="min-h-[120px]"
								placeholder="I'm a software engineer..."
								formControlName="about"
							></textarea>
							<hlm-field-description>
								Tell us more about yourself. This will be used to help us personalize your experience.
							</hlm-field-description>
							@if (form.controls.about.touched && form.controls.about.invalid) {
								<hlm-field-error>
									@if (form.controls.about.errors?.['required'] || form.controls.about.errors?.['minlength']) {
										Please provide at least 10 characters.
									}
									@if (form.controls.about.errors?.['maxlength']) {
										Please keep it under 200 characters.
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
					<button hlmBtn type="submit" form="form-textarea-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class ReactiveFormTextareaDemo {
	private readonly _fb = inject(FormBuilder);

	public form = this._fb.group({
		about: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
	});

	submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		console.log('You submitted the following values:', JSON.stringify(this.form.value, null, 2));
	}
}

export const reactiveFormsTextareaDemoCode = `
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-reactive-form-textarea-demo',
	imports: [ReactiveFormsModule, HlmCardImports, HlmFieldImports, HlmTextareaImports, HlmButtonImports],
	host: { class: 'w-full sm:max-w-md' },
	template: \`
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Personalization</h3>
				<p hlmCardDescription>Customize your experience by telling us more about yourself.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form id="form-textarea-demo" [formGroup]="form" (ngSubmit)="submit()">
					<hlm-field-group>
						<hlm-field>
							<label hlmFieldLabel for="about">More about you</label>
							<textarea
								hlmTextarea
								id="about"
								class="min-h-[120px]"
								placeholder="I'm a software engineer..."
								formControlName="about"
							></textarea>
							<hlm-field-description>
								Tell us more about yourself. This will be used to help us personalize your experience.
							</hlm-field-description>
							@if (form.controls.about.touched && form.controls.about.invalid) {
								<hlm-field-error>
									@if (form.controls.about.errors?.['required'] || form.controls.about.errors?.['minlength']) {
										Please provide at least 10 characters.
									}
									@if (form.controls.about.errors?.['maxlength']) {
										Please keep it under 200 characters.
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
					<button hlmBtn type="submit" form="form-textarea-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	\`,
})
export class ReactiveFormTextareaDemo {
	private readonly _fb = inject(FormBuilder);

	public form = this._fb.group({
		about: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
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
