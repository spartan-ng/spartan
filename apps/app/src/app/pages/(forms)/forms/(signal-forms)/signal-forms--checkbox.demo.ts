import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { disabled, form, FormField, minLength, submit } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-signal-form-checkbox-demo',
	imports: [FormField, HlmCardImports, HlmFieldImports, HlmCheckboxImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'w-full sm:max-w-md' },
	template: `
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Notifications</h3>
				<p hlmCardDescription>Manage your notification preferences.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form novalidate id="form-checkbox-demo" (submit)="submit($event)">
					<hlm-field-group>
						<fieldset hlmFieldSet>
							<legend hlmFieldLegend variant="label">Responses</legend>
							<hlm-field-description>
								Get notified for requests that take time, like research or image generation.
							</hlm-field-description>
							<hlm-field-group>
								<hlm-field orientation="horizontal">
									<hlm-checkbox inputId="responses" [formField]="form.responses" />
									<label hlmFieldLabel class="font-normal" for="responses">Push notifications</label>
								</hlm-field>
							</hlm-field-group>
						</fieldset>
						<hlm-field-separator />
						<hlm-field-group>
							<fieldset hlmFieldSet>
								<legend hlmFieldLegend variant="label">Tasks</legend>
								<hlm-field-description>Get notified when tasks you've created have updates.</hlm-field-description>
								<hlm-field-group data-slot="checkbox-group">
									@for (task of tasks; track task.id) {
										<hlm-field
											orientation="horizontal"
											[forceInvalid]="form.tasks().invalid() && form.tasks().touched()"
										>
											<hlm-checkbox
												[inputId]="'task-' + task.id"
												[forceInvalid]="form.tasks().invalid() && form.tasks().touched()"
												[checked]="form.tasks().value().includes(task.id)"
												(checkedChange)="handleChange($event, task.id)"
											/>
											<label hlmFieldLabel class="font-normal" [for]="'task-' + task.id">
												{{ task.label }}
											</label>
										</hlm-field>
									}
								</hlm-field-group>
							</fieldset>
							@if (form.tasks().invalid() && form.tasks().touched()) {
								@for (error of form.tasks().errors(); track error) {
									<hlm-field-error>{{ error.message }}</hlm-field-error>
								}
							}
						</hlm-field-group>
					</hlm-field-group>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field orientation="horizontal">
					<button hlmBtn variant="outline" type="button" (click)="reset()">Reset</button>
					<button hlmBtn type="submit" form="form-checkbox-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class SignalFormCheckboxDemo {
	protected readonly _model = signal<{
		responses: boolean;
		tasks: string[];
	}>({
		responses: true,
		tasks: [],
	});

	public readonly form = form(this._model, (schemaPath) => {
		disabled(schemaPath.responses);

		minLength(schemaPath.tasks, 1, { message: 'Please select at least one notification type.' });
	});

	public tasks = [
		{
			id: 'push',
			label: 'Push notifications',
		},
		{
			id: 'email',
			label: 'Email notifications',
		},
	];

	async submit(event: Event) {
		event.preventDefault();

		// marks all fields as touched, revealing validation errors
		submit(this.form, async () => {
			const model = this._model();

			console.log('You submitted the following values:', JSON.stringify(model, null, 2));
		});
	}

	handleChange(checked: boolean, id: string) {
		if (checked) {
			this.form.tasks().value.update((tasks) => [...tasks, id]);
		} else {
			this.form.tasks().value.update((tasks) => tasks.filter((taskId) => taskId !== id));
		}

		this.form.tasks().markAsTouched();
	}

	reset() {
		this.form().reset({
			responses: true,
			tasks: [],
		});
	}
}

export const signalFormsCheckboxDemoCode = `
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { disabled, form, FormField, minLength, required, submit } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-signal-form-checkbox-demo',
	imports: [FormField, HlmCardImports, HlmFieldImports, HlmCheckboxImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'w-full sm:max-w-md' },
	template: \`
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Notifications</h3>
				<p hlmCardDescription>Manage your notification preferences.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form novalidate id="form-checkbox-demo" (submit)="submit($event)">
					<hlm-field-group>
						<fieldset hlmFieldSet>
							<legend hlmFieldLegend variant="label">Responses</legend>
							<hlm-field-description>
								Get notified for requests that take time, like research or image generation.
							</hlm-field-description>
							<hlm-field-group>
								<hlm-field orientation="horizontal">
									<hlm-checkbox inputId="responses" [formField]="form.responses" />
									<label hlmFieldLabel class="font-normal" for="responses">Push notifications</label>
								</hlm-field>
							</hlm-field-group>
						</fieldset>
						<hlm-field-separator />
						<hlm-field-group>
							<fieldset hlmFieldSet>
								<legend hlmFieldLegend variant="label">Tasks</legend>
								<hlm-field-description>Get notified when tasks you've created have updates.</hlm-field-description>
								<hlm-field-group data-slot="checkbox-group">
									@for (task of tasks; track task.id) {
										<hlm-field
											orientation="horizontal"
											[forceInvalid]="form.tasks().invalid() && form.tasks().touched()"
										>
											<hlm-checkbox
												[inputId]="'task-' + task.id"
												[forceInvalid]="form.tasks().invalid() && form.tasks().touched()"
												[checked]="form.tasks().value().includes(task.id)"
												(checkedChange)="handleChange($event, task.id)"
											/>
											<label hlmFieldLabel class="font-normal" [for]="'task-' + task.id">
												{{ task.label }}
											</label>
										</hlm-field>
									}
								</hlm-field-group>
							</fieldset>
							@if (form.tasks().invalid() && form.tasks().touched()) {
								@for (error of form.tasks().errors(); track error) {
									<hlm-field-error>{{ error.message }}</hlm-field-error>
								}
							}
						</hlm-field-group>
					</hlm-field-group>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field orientation="horizontal">
					<button hlmBtn variant="outline" type="button" (click)="reset()">Reset</button>
					<button hlmBtn type="submit" form="form-checkbox-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	\`,
})
export class SignalFormCheckboxDemo {
	protected readonly _model = signal<{
		responses: boolean;
		tasks: string[];
	}>({
		responses: true,
		tasks: [],
	});

	public readonly form = form(this._model, (schemaPath) => {
		disabled(schemaPath.responses);

		required(schemaPath.tasks, { message: 'Please select at least one notification type.' });
		minLength(schemaPath.tasks, 1, { message: 'Please select at least one notification type.' });
	});

	public tasks = [
		{
			id: 'push',
			label: 'Push notifications',
		},
		{
			id: 'email',
			label: 'Email notifications',
		},
	];

	async submit(event: Event) {
		event.preventDefault();

		// marks all fields as touched, revealing validation errors
		submit(this.form, async () => {
			const model = this._model();

			console.log('You submitted the following values:', JSON.stringify(model, null, 2));
		});
	}

	handleChange(checked: boolean, id: string) {
		if (checked) {
			this.form.tasks().value.update((tasks) => [...tasks, id]);
		} else {
			this.form.tasks().value.update((tasks) => tasks.filter((taskId) => taskId !== id));
		}

		this.form.tasks().markAsTouched();
	}

	reset() {
		this.form().reset({
			responses: true,
			tasks: [],
		});
	}
}
`;
