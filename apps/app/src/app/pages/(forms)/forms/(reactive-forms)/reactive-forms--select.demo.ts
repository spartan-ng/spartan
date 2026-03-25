import { Component, inject } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	ReactiveFormsModule,
	ValidationErrors,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-reactive-form-select-demo',
	imports: [ReactiveFormsModule, HlmCardImports, HlmFieldImports, HlmSelectImports, HlmButtonImports],
	host: { class: 'w-full sm:max-w-md' },
	template: `
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Language Preferences</h3>
				<p hlmCardDescription>Select your preferred spoken language.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form id="form-select-demo" [formGroup]="form" (ngSubmit)="submit()">
					<hlm-field-group>
						<hlm-field orientation="responsive">
							<hlm-field-content>
								<label hlmFieldLabel for="language">Spoken Language</label>
								<hlm-field-description>For best results, select the language you speak.</hlm-field-description>
								<hlm-field-error validator="required">Please select your spoken language.</hlm-field-error>
								<hlm-field-error validator="autoDetect">
									Auto-detection is not allowed. Please select a specific language.
								</hlm-field-error>
							</hlm-field-content>
							<hlm-select formControlName="language" [itemToString]="itemToString">
								<hlm-select-trigger buttonId="language">
									<hlm-select-value placeholder="Select" />
								</hlm-select-trigger>
								<hlm-select-content *hlmSelectPortal>
									<hlm-select-group>
										<hlm-select-item value="auto">Auto</hlm-select-item>
										<div hlmSelectSeparator></div>
										@for (language of spokenLanguages; track $index) {
											<hlm-select-item [value]="language.value">{{ language.label }}</hlm-select-item>
										}
									</hlm-select-group>
								</hlm-select-content>
							</hlm-select>
						</hlm-field>
					</hlm-field-group>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field orientation="horizontal">
					<button hlmBtn variant="outline" type="button" (click)="form.reset()">Reset</button>
					<button hlmBtn type="submit" form="form-select-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class ReactiveFormSelectDemo {
	private readonly _fb = inject(FormBuilder);

	public spokenLanguages = [
		{ label: 'English', value: 'en' },
		{ label: 'Spanish', value: 'es' },
		{ label: 'French', value: 'fr' },
		{ label: 'German', value: 'de' },
		{ label: 'Italian', value: 'it' },
		{ label: 'Chinese', value: 'zh' },
		{ label: 'Japanese', value: 'ja' },
	];

	public itemToString = (value: string) => {
		if (value === 'auto') {
			return 'Auto';
		}
		const language = this.spokenLanguages.find((lang) => lang.value === value);
		return language ? language.label : '';
	};

	public form = this._fb.group({
		language: ['', [Validators.required, autoDetectLanguage()]],
	});

	submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		console.log('You submitted the following values:', JSON.stringify(this.form.value, null, 2));
	}
}

function autoDetectLanguage(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		return control.value === 'auto' ? { autoDetect: true } : null;
	};
}

export const reactiveFormsSelectDemoCode = `
import { Component, inject } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	ReactiveFormsModule,
	ValidationErrors,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-reactive-form-select-demo',
	imports: [ReactiveFormsModule, HlmCardImports, HlmFieldImports, HlmSelectImports, HlmButtonImports],
	host: { class: 'w-full sm:max-w-md' },
	template: \`
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Language Preferences</h3>
				<p hlmCardDescription>Select your preferred spoken language.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form id="form-select-demo" [formGroup]="form" (ngSubmit)="submit()">
					<hlm-field-group>
						<hlm-field orientation="responsive">
							<hlm-field-content>
								<label hlmFieldLabel for="language">Spoken Language</label>
								<hlm-field-description>For best results, select the language you speak.</hlm-field-description>
								@if (form.controls.language.touched && form.controls.language.invalid) {
									<hlm-field-error>
										@if (form.controls.language.errors?.['required']) {
											Please select your spoken language.
										}
										@if (form.controls.language.errors?.['autoDetect']) {
											Auto-detection is not allowed. Please select a specific language.
										}
									</hlm-field-error>
								}
							</hlm-field-content>
							<hlm-select formControlName="language" [itemToString]="itemToString">
								<hlm-select-trigger buttonId="language">
									<hlm-select-value placeholder="Select" />
								</hlm-select-trigger>
								<hlm-select-content *hlmSelectPortal>
									<hlm-select-group>
										<hlm-select-item value="auto">Auto</hlm-select-item>
										<div hlmSelectSeparator></div>
										@for (language of spokenLanguages; track $index) {
											<hlm-select-item [value]="language.value">{{ language.label }}</hlm-select-item>
										}
									</hlm-select-group>
								</hlm-select-content>
							</hlm-select>
						</hlm-field>
					</hlm-field-group>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field orientation="horizontal">
					<button hlmBtn variant="outline" type="button" (click)="form.reset()">Reset</button>
					<button hlmBtn type="submit" form="form-select-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	\`,
})
export class ReactiveFormSelectDemo {
	private readonly _fb = inject(FormBuilder);

	public spokenLanguages = [
		{ label: 'English', value: 'en' },
		{ label: 'Spanish', value: 'es' },
		{ label: 'French', value: 'fr' },
		{ label: 'German', value: 'de' },
		{ label: 'Italian', value: 'it' },
		{ label: 'Chinese', value: 'zh' },
		{ label: 'Japanese', value: 'ja' },
	];

	public itemToString = (value: string) => {
		if (value === 'auto') {
			return 'Auto';
		}
		const language = this.spokenLanguages.find((lang) => lang.value === value);
		return language ? language.label : '';
	};

	public form = this._fb.group({
		language: ['', [Validators.required, autoDetectLanguage()]],
	});

	submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		console.log('You submitted the following values:', JSON.stringify(this.form.value, null, 2));
	}
}

function autoDetectLanguage(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		return control.value === 'auto' ? { autoDetect: true } : null;
	};
}
`;
