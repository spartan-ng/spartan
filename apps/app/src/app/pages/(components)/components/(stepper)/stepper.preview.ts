import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmStepperImports } from '@spartan-ng/helm/stepper';

@Component({
	selector: 'spartan-stepper-preview',
	imports: [HlmStepperImports, HlmButtonImports],
	host: {
		class: 'w-full',
	},
	template: `
		<hlm-stepper>
			<hlm-step label="Step One">
				<div class="flex flex-col gap-4">
					<div
						class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
					>
						Content 1
					</div>
					<div class="flex justify-end">
						<button hlmBtn hlmStepperNext>Next</button>
					</div>
				</div>
			</hlm-step>

			<hlm-step label="Step Two">
				<div class="flex flex-col gap-4">
					<div
						class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
					>
						Content 2
					</div>
					<div class="flex justify-between gap-2">
						<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
						<button hlmBtn hlmStepperNext>Next</button>
					</div>
				</div>
			</hlm-step>

			<hlm-step label="Step Three">
				<div class="flex flex-col gap-4">
					<div
						class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
					>
						Content 3
					</div>

					<div class="flex justify-between gap-2">
						<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
						<button hlmBtn>Finish</button>
					</div>
				</div>
			</hlm-step>
		</hlm-stepper>
	`,
})
export class StepperPreview {}

export const defaultImports = `
import { HlmStepperImports } from '@spartan-ng/helm/stepper';
`;

export const defaultSkeleton = `
<hlm-stepper>
  <hlm-step label="Account">
      <div class="flex justify-end">
        <button hlmBtn hlmStepperNext>Next</button>
      </div>
  </hlm-step>

  <hlm-step label="Review">
    <div class="flex justify-between gap-2">
      <button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
      <button hlmBtn>Submit</button>
    </div>
  </hlm-step>
</hlm-stepper>
`;
