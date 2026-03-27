import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmStepperImports } from '@spartan-ng/helm/stepper';

@Component({selector: 'spartan-stepper-lazy-content-preview',
imports: [HlmStepperImports, HlmButtonImports],
changeDetection: ChangeDetectionStrategy.OnPush,
host: {
		class: 'w-full',
	},
template: `
		<hlm-stepper>
			<hlm-step label="Overview">
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
						<button hlmBtn hlmStepperNext>Inspect lazy content</button>
					</div>
				</div>
			</hlm-step>

			<hlm-step label="Analytics">
				<ng-template hlmStepContent>
					<div
						class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
					>
						Lazy analytics content
					</div>

					<div class="mt-4 flex justify-between gap-2">
						<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
						<button hlmBtn hlmStepperNext>Next</button>
					</div>
				</ng-template>
			</hlm-step>

			<hlm-step label="Summary">
				<ng-template hlmStepContent>
					<div class="flex flex-col gap-4">
						<div
							class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
						>
							<p class="text-muted-foreground max-w-sm text-center text-sm">
								Lazy steps keep the initial render lighter while preserving the same stepper API.
							</p>
						</div>

						<div class="flex justify-between gap-2">
							<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
							<button hlmBtn>Done</button>
						</div>
					</div>
				</ng-template>
			</hlm-step>
		</hlm-stepper>
	`})
export class StepperLazyContentPreview {}

