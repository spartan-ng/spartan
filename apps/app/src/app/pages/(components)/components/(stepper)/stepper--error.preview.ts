import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmStepperImports } from '@spartan-ng/helm/stepper';

@Component({
	selector: 'spartan-stepper-error-preview',
	imports: [ReactiveFormsModule, HlmStepperImports, HlmButtonImports, HlmFieldImports, HlmInputImports],
	providers: [
		{
			provide: STEPPER_GLOBAL_OPTIONS,
			useValue: { showError: true },
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-stepper>
			<hlm-step
				[stepControl]="contactForm"
				[hasError]="contactForm.invalid && contactForm.touched"
				errorMessage="Enter a valid work email before continuing."
				label="Contact"
			>
				<form [formGroup]="contactForm" class="flex flex-col gap-4">
					<hlm-field>
						<label hlmFieldLabel for="error-email">Work Email</label>
						<input
							hlmInput
							id="error-email"
							formControlName="email"
							placeholder="Required to remove the error state"
						/>
						@if (contactForm.controls.email.touched && contactForm.controls.email.invalid) {
							<hlm-field-error>
								@if (contactForm.controls.email.errors?.['required']) {
									This field is required.
								} @else if (contactForm.controls.email.errors?.['email']) {
									Enter a valid email address.
								}
							</hlm-field-error>
						}
					</hlm-field>

					<p class="text-muted-foreground text-sm">
						This example is intentionally non-linear. Click next without filling the field to move forward and
						trigger the header error state.
					</p>

					<div class="flex justify-end">
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
							Because
							<code class="text-foreground font-mono">showError</code>
							is enabled through
							<code class="text-foreground font-mono">STEPPER_GLOBAL_OPTIONS</code>
							, the previous step now displays its error message in the header.
						</p>
					</div>

					<div class="flex justify-between gap-2">
						<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
						<button hlmBtn>Finish</button>
					</div>
				</div>
			</hlm-step>
		</hlm-stepper>
	`,
	host: {
		class: 'w-full',
	},
})
export class StepperErrorPreview {
	private readonly _formBuilder = inject(FormBuilder);

	protected readonly contactForm = this._formBuilder.group({
		email: ['', [Validators.required, Validators.email]],
	});
}

