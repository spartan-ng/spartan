import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required, submit, validate } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-signal-form-select-demo',
	imports: [FormField, HlmCardImports, HlmFieldImports, HlmSelectImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'w-full sm:max-w-md' },
	template: `
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Language Preferences</h3>
				<p hlmCardDescription>Select your preferred spoken language.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form novalidate id="form-select-demo" (submit)="submit($event)">
					<hlm-field-group>
						<hlm-field orientation="responsive">
							<hlm-field-content>
								<label hlmFieldLabel for="language">Spoken Language</label>
								<hlm-field-description>For best results, select the language you speak.</hlm-field-description>

								@for (error of form.language().errors(); track error) {
									<hlm-field-error [validator]="error.kind">
										{{ error.message }}
									</hlm-field-error>
								}
							</hlm-field-content>
							<hlm-select [formField]="form.language" [itemToString]="itemToString">
								<hlm-select-trigger buttonId="language">
									<hlm-select-value placeholder="Select" />
								</hlm-select-trigger>
								<hlm-select-content *hlmSelectPortal>
									<hlm-select-group>
										<hlm-select-item value="auto">Auto</hlm-select-item>
										<div hlmSelectSeparator></div>
										@for (language of spokenLanguages; track $index) {
											<hlm-select-item [value]="language.value">
												{{ language.label }}
											</hlm-select-item>
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
					<button hlmBtn variant="outline" type="button" (click)="reset()">Reset</button>
					<button hlmBtn type="submit" form="form-select-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class SignalFormSelectDemo {
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

	protected readonly _model = signal<{
		language: string | null;
	}>({
		language: null,
	});

	public readonly form = form(this._model, (schemaPath) => {
		required(schemaPath.language, { message: 'Language is a required field.' });
		validate(schemaPath.language, ({ value }) => {
			if (value() === 'auto') {
				return {
					kind: 'auto-detect',
					message: 'Auto-detection is not allowed. Please select a specific language.',
				};
			}
			return null;
		});
	});

	async submit(event: Event) {
		event.preventDefault();

		// marks all fields as touched, revealing validation errors
		submit(this.form, async () => {
			const model = this._model();

			console.log('You submitted the following values:', JSON.stringify(model, null, 2));
		});
	}

	reset() {
		this.form().reset({
			language: null,
		});
	}
}

export const signalFormsSelectDemoCode = `
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required, submit, validate } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-signal-form-select-demo',
	imports: [FormField, HlmCardImports, HlmFieldImports, HlmSelectImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'w-full sm:max-w-md' },
	template: \`
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Language Preferences</h3>
				<p hlmCardDescription>Select your preferred spoken language.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form novalidate id="form-select-demo" (submit)="submit($event)">
					<hlm-field-group>
						<hlm-field orientation="responsive">
							<hlm-field-content>
								<label hlmFieldLabel for="language">Spoken Language</label>
								<hlm-field-description>For best results, select the language you speak.</hlm-field-description>

								@for (error of form.language().errors(); track error) {
									<hlm-field-error [validator]="error.kind">
										{{ error.message }}
									</hlm-field-error>
								}
							</hlm-field-content>
							<hlm-select [formField]="form.language" [itemToString]="itemToString">
								<hlm-select-trigger buttonId="language">
									<hlm-select-value placeholder="Select" />
								</hlm-select-trigger>
								<hlm-select-content *hlmSelectPortal>
									<hlm-select-group>
										<hlm-select-item value="auto">Auto</hlm-select-item>
										<div hlmSelectSeparator></div>
										@for (language of spokenLanguages; track $index) {
											<hlm-select-item [value]="language.value">
												{{ language.label }}
											</hlm-select-item>
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
					<button hlmBtn variant="outline" type="button" (click)="reset()">Reset</button>
					<button hlmBtn type="submit" form="form-select-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	\`,
})
export class SignalFormSelectDemo {
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

	protected readonly _model = signal<{
		language: string | null;
	}>({
		language: null,
	});

	public readonly form = form(this._model, (schemaPath) => {
		required(schemaPath.language, { message: 'Language is a required field.' });
		validate(schemaPath.language, ({ value }) => {
			if (value() === 'auto') {
				return {
					kind: 'auto-detect',
					message: 'Auto-detection is not allowed. Please select a specific language.',
				};
			}
			return null;
		});
	});

	async submit(event: Event) {
		event.preventDefault();

		// marks all fields as touched, revealing validation errors
		submit(this.form, async () => {
			const model = this._model();

			console.log('You submitted the following values:', JSON.stringify(model, null, 2));
		});
	}

	reset() {
		this.form().reset({
			language: null,
		});
	}
}
`;
