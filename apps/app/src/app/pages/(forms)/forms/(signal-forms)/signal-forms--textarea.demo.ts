import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, required, submit } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-signal-form-textarea-demo',
	imports: [FormField, HlmCardImports, HlmFieldImports, HlmTextareaImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'w-full sm:max-w-md' },
	template: `
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Personalization</h3>
				<p hlmCardDescription>Customize your experience by telling us more about yourself.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form novalidate id="form-textarea-demo" (submit)="submit($event)">
					<hlm-field-group>
						<hlm-field>
							<label hlmFieldLabel for="about">More about you</label>
							<textarea
								hlmTextarea
								id="about"
								class="min-h-32"
								placeholder="I'm a software engineer..."
								[formField]="form.about"
							></textarea>
							<hlm-field-description>
								Tell us more about yourself. This will be used to help us personalize your experience.
							</hlm-field-description>
							@for (error of form.about().errors(); track error) {
								<hlm-field-error [validator]="error.kind">
									{{ error.message }}
								</hlm-field-error>
							}
						</hlm-field>
					</hlm-field-group>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field orientation="horizontal">
					<button hlmBtn variant="outline" type="button" (click)="reset()">Reset</button>
					<button hlmBtn type="submit" form="form-textarea-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class SignalFormTextareaDemo {
	protected readonly _model = signal({
		about: '',
	});

	public readonly form = form(this._model, (schemaPath) => {
		required(schemaPath.about, { message: 'This is a required field.' });
		minLength(schemaPath.about, 10, { message: 'Please provide at least 10 characters.' });
		maxLength(schemaPath.about, 200, { message: 'Please keep it under 200 characters.' });
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
			about: '',
		});
	}
}

export const signalFormsTextareaDemoCode = `
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, required, submit } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-signal-form-textarea-demo',
	imports: [FormField, HlmCardImports, HlmFieldImports, HlmTextareaImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'w-full sm:max-w-md' },
	template: \`
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Personalization</h3>
				<p hlmCardDescription>Customize your experience by telling us more about yourself.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form novalidate id="form-textarea-demo" (submit)="submit($event)">
					<hlm-field-group>
						<hlm-field>
							<label hlmFieldLabel for="about">More about you</label>
							<textarea
								hlmTextarea
								id="about"
								class="min-h-32"
								placeholder="I'm a software engineer..."
								[formField]="form.about"
							></textarea>
							<hlm-field-description>
								Tell us more about yourself. This will be used to help us personalize your experience.
							</hlm-field-description>
							@for (error of form.about().errors(); track error) {
								<hlm-field-error [validator]="error.kind">
									{{ error.message }}
								</hlm-field-error>
							}
						</hlm-field>
					</hlm-field-group>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field orientation="horizontal">
					<button hlmBtn variant="outline" type="button" (click)="reset()">Reset</button>
					<button hlmBtn type="submit" form="form-textarea-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	\`,
})
export class SignalFormTextareaDemo {
	protected readonly _model = signal({
		about: '',
	});

	public readonly form = form(this._model, (schemaPath) => {
		required(schemaPath.about, { message: 'This is a required field.' });
		minLength(schemaPath.about, 10, { message: 'Please provide at least 10 characters.' });
		maxLength(schemaPath.about, 200, { message: 'Please keep it under 200 characters.' });
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
			about: '',
		});
	}
}
`;
