import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { SpartanStepperImports } from '../../../(blocks)/blocks/stepper/lib';

@Component({
	selector: 'spartan-stepper-linear',
	imports: [ReactiveFormsModule, SpartanStepperImports, HlmButtonImports, HlmFieldImports, HlmInputImports],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex min-h-svh w-full justify-center p-6 md:p-10">
			<div class="w-full max-w-2xl">
				<spartan-stepper [linear]="true">
					<spartan-step [stepControl]="_identityForm" label="Identity">
						<form [formGroup]="_identityForm" class="flex flex-col gap-4">
							<hlm-field>
								<label hlmFieldLabel for="validation-name">Name</label>
								<input hlmInput id="validation-name" formControlName="name" placeholder="Required before continuing" />
								@if (_identityForm.controls.name.touched && _identityForm.controls.name.invalid) {
									<hlm-field-error>This field is required.</hlm-field-error>
								}
							</hlm-field>

							<div class="flex justify-end">
								<button hlmBtn spartanStepperNext>Next</button>
							</div>
						</form>
					</spartan-step>

					<spartan-step [stepControl]="_securityForm">
						<ng-template hlmStepLabel>Security</ng-template>

						<form [formGroup]="_securityForm" class="flex flex-col gap-4">
							<hlm-field>
								<label hlmFieldLabel for="validation-password">Temporary Password</label>
								<input
									hlmInput
									id="validation-password"
									formControlName="password"
									placeholder="At least 8 characters"
								/>
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
								<button hlmBtn variant="outline" spartanStepperPrevious>Back</button>
								<button hlmBtn spartanStepperNext>Next</button>
							</div>
						</form>
					</spartan-step>

					<spartan-step label="Review">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								<p class="text-muted-foreground max-w-sm text-center text-sm">
									<code class="text-foreground font-mono">spartanStepperNext</code>
									respects
									<code class="text-foreground font-mono">linear</code>
									mode, and
									<code class="text-foreground font-mono">HlmStepper.next()</code>
									marks the current step form as touched before the transition is denied.
								</p>
							</div>

							<div class="flex justify-between gap-2">
								<button hlmBtn variant="outline" spartanStepperPrevious>Back</button>
								<button hlmBtn>Complete</button>
							</div>
						</div>
					</spartan-step>
				</spartan-stepper>
			</div>
		</div>
	`,
})
export default class StepperLinearPage {
	private readonly _formBuilder = inject(FormBuilder);

	protected readonly _identityForm = this._formBuilder.group({
		name: ['', Validators.required],
	});

	protected readonly _securityForm = this._formBuilder.group({
		password: ['', [Validators.required, Validators.minLength(8)]],
	});
}
