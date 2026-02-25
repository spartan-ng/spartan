import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-reactive-form-checkbox-demo',
	imports: [ReactiveFormsModule, HlmCardImports, HlmFieldImports, HlmCheckboxImports, HlmButtonImports],
	host: { class: 'w-full sm:max-w-md' },
	template: `
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Notifications</h3>
				<p hlmCardDescription>Manage your notification preferences.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form id="form-checkbox-demo" [formGroup]="form" (ngSubmit)="submit()">
					<hlm-field-group>
						<fieldset hlmFieldSet>
							<legend hlmFieldLegend variant="label">Responses</legend>
							<hlm-field-description>
								Get notified for requests that take time, like research or image generation.
							</hlm-field-description>
							<hlm-field-group>
								<hlm-field orientation="horizontal">
									<hlm-checkbox id="responses" formControlName="responses" />
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
										<hlm-field orientation="horizontal">
											<hlm-checkbox
												[id]="'task-' + task.id"
												[checked]="form.controls.tasks.value.includes(task.id)"
												(checkedChange)="handleChange($event, task.id)"
											/>
											<label hlmFieldLabel class="font-normal" [for]="'task-' + task.id">{{ task.label }}</label>
										</hlm-field>
									}
								</hlm-field-group>
							</fieldset>
							@if (form.controls.tasks.invalid && form.controls.tasks.touched) {
								<hlm-field-error>Please select at least one notification type.</hlm-field-error>
							}
						</hlm-field-group>
					</hlm-field-group>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field orientation="horizontal">
					<button hlmBtn variant="outline" type="button" (click)="form.reset({ responses: true, tasks: [] })">
						Reset
					</button>
					<button hlmBtn type="submit" form="form-checkbox-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class ReactiveFormCheckboxDemo {
	private readonly _fb = inject(FormBuilder);

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

	public form = this._fb.group({
		responses: [{ value: true, disabled: true }],
		tasks: this._fb.array([], Validators.required),
	});

	handleChange(checked: boolean, id: string) {
		const tasks = this.form.controls.tasks;

		if (checked) {
			tasks.push(this._fb.control(id));
		} else {
			const index = tasks.controls.findIndex((x) => x.value === id);
			tasks.removeAt(index);
		}

		this.form.controls.tasks.markAsTouched();
	}

	submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		console.log('You submitted the following values:', JSON.stringify(this.form.getRawValue(), null, 2));
	}
}

export const reactiveFormsCheckboxDemoCode = `
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-reactive-form-checkbox-demo',
	imports: [ReactiveFormsModule, HlmCardImports, HlmFieldImports, HlmCheckboxImports, HlmButtonImports],
	host: { class: 'w-full sm:max-w-md' },
	template: \`
		<hlm-card>
			<hlm-card-header>
				<h3 hlmCardTitle>Notifications</h3>
				<p hlmCardDescription>Manage your notification preferences.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<form id="form-checkbox-demo" [formGroup]="form" (ngSubmit)="submit()">
					<hlm-field-group>
						<fieldset hlmFieldSet>
							<legend hlmFieldLegend variant="label">Responses</legend>
							<hlm-field-description>
								Get notified for requests that take time, like research or image generation.
							</hlm-field-description>
							<hlm-field-group>
								<hlm-field orientation="horizontal">
									<hlm-checkbox id="responses" formControlName="responses" />
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
										<hlm-field orientation="horizontal">
											<hlm-checkbox
												[id]="'task-' + task.id"
												[checked]="form.controls.tasks.value.includes(task.id)"
												(checkedChange)="handleChange($event, task.id)"
											/>
											<label hlmFieldLabel class="font-normal" [for]="'task-' + task.id">{{ task.label }}</label>
										</hlm-field>
									}
								</hlm-field-group>
							</fieldset>
							@if (form.controls.tasks.invalid && form.controls.tasks.touched) {
								<hlm-field-error>Please select at least one notification type.</hlm-field-error>
							}
						</hlm-field-group>
					</hlm-field-group>
				</form>
			</div>
			<hlm-card-footer>
				<hlm-field orientation="horizontal">
					<button hlmBtn variant="outline" type="button" (click)="form.reset({ responses: true, tasks: [] })">
						Reset
					</button>
					<button hlmBtn type="submit" form="form-checkbox-demo">Submit</button>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	\`,
})
export class ReactiveFormCheckboxDemo {
	private readonly _fb = inject(FormBuilder);

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

	public form = this._fb.group({
		responses: [{ value: true, disabled: true }],
		tasks: this._fb.array([], Validators.required),
	});

	handleChange(checked: boolean, id: string) {
		const tasks = this.form.controls.tasks;

		if (checked) {
			tasks.push(this._fb.control(id));
		} else {
			const index = tasks.controls.findIndex((x) => x.value === id);
			tasks.removeAt(index);
		}

		this.form.controls.tasks.markAsTouched();
	}

	submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		console.log('You submitted the following values:', JSON.stringify(this.form.getRawValue(), null, 2));
	}
}
`;
