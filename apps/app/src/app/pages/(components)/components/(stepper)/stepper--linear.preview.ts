import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmStepperImports } from '@spartan-ng/helm/stepper';

@Component({
	selector: 'spartan-stepper-linear-preview',
	imports: [ReactiveFormsModule, HlmStepperImports, HlmButtonImports, HlmFieldImports, HlmInputImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full',
	},
	template: `
		<hlm-stepper [linear]="true">
			<hlm-step [stepControl]="_identityForm" label="Identity">
				<form [formGroup]="_identityForm" class="flex flex-col gap-4">
					<hlm-field>
						<label hlmFieldLabel for="validation-name">Name</label>
						<input hlmInput id="validation-name" formControlName="name" placeholder="Required before continuing" />
						@if (_identityForm.controls.name.touched && _identityForm.controls.name.invalid) {
							<hlm-field-error>This field is required.</hlm-field-error>
						}
					</hlm-field>

					<div class="flex justify-end">
						<button hlmBtn hlmStepperNext>Next</button>
					</div>
				</form>
			</hlm-step>

			<hlm-step [stepControl]="_securityForm">
				<ng-template hlmStepLabel>Security</ng-template>

				<form [formGroup]="_securityForm" class="flex flex-col gap-4">
					<hlm-field>
						<label hlmFieldLabel for="validation-password">Temporary Password</label>
						<input hlmInput id="validation-password" formControlName="password" placeholder="At least 8 characters" />
						@if (_securityForm.controls.password.touched && _securityForm.controls.password.invalid) {
							<hlm-field-error>
								@if (_securityForm.controls.password.errors?.['required']) {
									This field is required.
								} @else if (_securityForm.controls.password.errors?.['minlength']) {
									Password must be at least 8 characters.
								}
							</hlm-field-error>
						}
					</hlm-field>

					<div class="flex justify-between gap-2">
						<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
						<button hlmBtn hlmStepperNext>Next</button>
					</div>
				</form>
			</hlm-step>

			<hlm-step label="Review">
				<div class="flex flex-col gap-4">
					<div
						class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
					>
						<p class="text-muted-foreground max-w-sm text-center text-sm">
							<code class="text-foreground font-mono">hlmStepperNext</code>
							respects
							<code class="text-foreground font-mono">linear</code>
							mode, and
							<code class="text-foreground font-mono">HlmStepper.next()</code>
							marks the current step form as touched before the transition is denied.
						</p>
					</div>

					<div class="flex justify-between gap-2">
						<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
						<button hlmBtn>Complete</button>
					</div>
				</div>
			</hlm-step>
		</hlm-stepper>
	`,
})
export class StepperLinearPreview {
	private readonly _formBuilder = inject(FormBuilder);

	protected readonly _identityForm = this._formBuilder.group({
		name: ['', Validators.required],
	});

	protected readonly _securityForm = this._formBuilder.group({
		password: ['', [Validators.required, Validators.minLength(8)]],
	});
}

