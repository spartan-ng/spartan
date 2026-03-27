import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmStepperImports } from '@spartan-ng/helm/stepper';


@Component({
	selector: 'spartan-stepper-basic-preview',
	imports: [HlmStepperImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
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
  host: {
    class: 'w-full',
  }
})
export class StepperBasicPreview {}
