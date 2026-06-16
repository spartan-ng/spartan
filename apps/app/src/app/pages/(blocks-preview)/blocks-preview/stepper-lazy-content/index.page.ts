import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { SpartanStepperImports } from '../../../(blocks)/blocks/stepper/lib';

@Component({
	selector: 'spartan-stepper-lazy-content',
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
					<spartan-step label="Overview">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								<p class="text-muted-foreground max-w-sm text-center text-sm">
									The first step renders immediately. Later steps use
									<code class="text-foreground font-mono">hlmStepContent</code>
									so their bodies are attached lazily.
								</p>
							</div>

							<div class="flex justify-end">
								<button hlmBtn spartanStepperNext>Inspect lazy content</button>
							</div>
						</div>
					</spartan-step>

					<spartan-step label="Analytics">
						<ng-template spartanStepContent>
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								Lazy analytics content
							</div>

							<div class="mt-4 flex justify-between gap-2">
								<button hlmBtn variant="outline" spartanStepperPrevious>Back</button>
								<button hlmBtn spartanStepperNext>Next</button>
							</div>
						</ng-template>
					</spartan-step>

					<spartan-step label="Summary">
						<ng-template spartanStepContent>
							<div class="flex flex-col gap-4">
								<div
									class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
								>
									<p class="text-muted-foreground max-w-sm text-center text-sm">
										Lazy steps keep the initial render lighter while preserving the same stepper API.
									</p>
								</div>

								<div class="flex justify-between gap-2">
									<button hlmBtn variant="outline" spartanStepperPrevious>Back</button>
									<button hlmBtn>Done</button>
								</div>
							</div>
						</ng-template>
					</spartan-step>
				</spartan-stepper>
			</div>
		</div>
	`,
})
export default class StepperLazyContentPage {}
