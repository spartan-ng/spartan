import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmStepperImports } from '@spartan-ng/helm/stepper';

@Component({selector: 'spartan-stepper-vertical-preview',
imports: [HlmStepperImports, HlmButtonImports],
changeDetection: ChangeDetectionStrategy.OnPush,
host: {
		class: 'w-full',
	},
template: `
		<hlm-stepper orientation="vertical">
			<hlm-step label="Campaign">
				<div class="flex flex-col gap-4">
					<div
						class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
					>
						<p class="text-muted-foreground max-w-sm text-center text-sm">
							Use the vertical orientation when content is dense or the available horizontal space is limited.
						</p>
					</div>

					<div class="flex justify-end">
						<button hlmBtn hlmStepperNext>Next</button>
					</div>
				</div>
			</hlm-step>

			<hlm-step label="Audience">
				<div class="flex flex-col gap-4">
					<div
						class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
					>
						<p class="text-muted-foreground max-w-sm text-center text-sm">
							Vertical steppers keep each header aligned with its content panel and are easier to scan on narrow
							layouts.
						</p>
					</div>

					<div class="flex justify-between gap-2">
						<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
						<button hlmBtn hlmStepperNext>Next</button>
					</div>
				</div>
			</hlm-step>

			<hlm-step label="Review">
				<div class="flex flex-col gap-4">
					<div
						class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
					>
						<p class="text-muted-foreground max-w-sm text-center text-sm">
							Keep the rest of the docs horizontal, and reserve vertical orientation for flows that need the extra room.
						</p>
					</div>

					<div class="flex justify-between gap-2">
						<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
						<button hlmBtn>Publish</button>
					</div>
				</div>
			</hlm-step>
		</hlm-stepper>
	`})
export class StepperVerticalPreview {}
