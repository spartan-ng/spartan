import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { SpartanStepperImports } from '../../../(blocks)/blocks/stepper/lib';

@Component({
	selector: 'spartan-stepper-basic',
	imports: [SpartanStepperImports, HlmButtonImports],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex min-h-svh w-full justify-center p-6 md:p-10">
			<div class="w-full max-w-2xl">
				<spartan-stepper>
					<spartan-step label="Step One">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								Content 1
							</div>
							<div class="flex justify-end">
								<button hlmBtn spartanStepperNext>Next</button>
							</div>
						</div>
					</spartan-step>

					<spartan-step label="Step Two">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								Content 2
							</div>
							<div class="flex justify-between gap-2">
								<button hlmBtn variant="outline" spartanStepperPrevious>Back</button>
								<button hlmBtn spartanStepperNext>Next</button>
							</div>
						</div>
					</spartan-step>

					<spartan-step label="Step Three">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								Content 3
							</div>

							<div class="flex justify-between gap-2">
								<button hlmBtn variant="outline" spartanStepperPrevious>Back</button>
								<button hlmBtn>Finish</button>
							</div>
						</div>
					</spartan-step>
				</spartan-stepper>
			</div>
		</div>
	`,
})
export default class StepperBasicPage {}
