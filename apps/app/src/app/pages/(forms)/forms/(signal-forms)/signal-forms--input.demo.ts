import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, pattern, required, submit } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-signal-form-input-demo',
	imports: [FormField, HlmCardImports, HlmFieldImports, HlmInputImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'w-full sm:max-w-md' },
	template: `
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Profile Settings</h3>
				<p hlmCardDescription>Update your profile information below.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form novalidate id="form-input-demo" (submit)="submit($event)">
					<hlm-field-group>
						<hlm-field>
							<label hlmFieldLabel for="username">Username</label>
							<input hlmInput id="username" placeholder="spartan" autoComplete="username" [formField]="form.username" />
							<hlm-field-description>
								This is your public display name. Must be between 3 and 10 characters. Must only contain letters,
								numbers, and underscores.
							</hlm-field-description>
							@for (error of form.username().errors(); track error) {
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
					<button hlmBtn type="submit" form="form-input-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class SignalFormInputDemo {
	protected readonly _model = signal({
		username: '',
	});

	public readonly form = form(this._model, (schemaPath) => {
		required(schemaPath.username, { message: 'Username is a required field.' });
		minLength(schemaPath.username, 3, { message: 'Username must be at least 3 characters.' });
		maxLength(schemaPath.username, 10, { message: 'Username must be at most 10 characters.' });
		pattern(schemaPath.username, /^[a-zA-Z0-9_]+$/, {
			message: 'Username can only contain letters, numbers, and underscores.',
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
			username: '',
		});
	}
}

export const signalFormsInputDemoCode = `
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, pattern, required, submit } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-signal-form-input-demo',
	imports: [FormField, HlmCardImports, HlmFieldImports, HlmInputImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'w-full sm:max-w-md' },
	template: \`
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Profile Settings</h3>
				<p hlmCardDescription>Update your profile information below.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form novalidate id="form-input-demo" (submit)="submit($event)">
					<hlm-field-group>
						<hlm-field>
							<label hlmFieldLabel for="username">Username</label>
							<input hlmInput id="username" placeholder="spartan" autoComplete="username" [formField]="form.username" />
							<hlm-field-description>
								This is your public display name. Must be between 3 and 10 characters. Must only contain letters,
								numbers, and underscores.
							</hlm-field-description>
							@for (error of form.username().errors(); track error) {
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
					<button hlmBtn type="submit" form="form-input-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	\`,
})
export class SignalFormInputDemo {
	protected readonly _model = signal({
		username: '',
	});

	public readonly form = form(this._model, (schemaPath) => {
		required(schemaPath.username, { message: 'Username is a required field.' });
		minLength(schemaPath.username, 3, { message: 'Username must be at least 3 characters.' });
		maxLength(schemaPath.username, 10, { message: 'Username must be at most 10 characters.' });
		pattern(schemaPath.username, /^[a-zA-Z0-9_]+$/, {
			message: 'Username can only contain letters, numbers, and underscores.',
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
			username: '',
		});
	}
}
`;
