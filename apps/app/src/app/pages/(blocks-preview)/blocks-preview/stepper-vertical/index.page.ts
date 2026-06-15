import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmStepperImports } from '../../../(blocks)/blocks/stepper/lib';

@Component({
	selector: 'spartan-stepper-vertical',
	imports: [HlmStepperImports, HlmButtonImports],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex min-h-svh w-full justify-center p-6 md:p-10">
			<div class="w-full max-w-2xl">
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
									Keep the rest of the docs horizontal, and reserve vertical orientation for flows that need the extra
									room.
								</p>
							</div>

							<div class="flex justify-between gap-2">
								<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
								<button hlmBtn>Publish</button>
							</div>
						</div>
					</hlm-step>
				</hlm-stepper>
			</div>
		</div>
	`,
})
export default class StepperVerticalPage {}
