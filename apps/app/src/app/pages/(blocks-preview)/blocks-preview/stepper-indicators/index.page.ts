import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideMail, lucideMapPin, lucideUser } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { SpartanStepperImports } from '../../../(blocks)/blocks/stepper/lib';

@Component({
	selector: 'spartan-stepper-indicators',
	imports: [SpartanStepperImports, HlmButtonImports],
	providers: [provideIcons({ lucideUser, lucideMapPin, lucideMail })],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex min-h-svh w-full justify-center p-6 md:p-10">
			<div class="w-full max-w-2xl space-y-6">
				<section class="flex flex-col gap-4 rounded-xl border p-5">
					<header class="space-y-1">
						<h3 class="font-medium">Number</h3>
						<p class="text-muted-foreground text-sm">Always renders 1, 2, 3.</p>
					</header>

					<spartan-stepper indicatorMode="number">
						<spartan-step label="Profile">
							<div class="flex flex-col gap-4">
								<div
									class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
								>
									Number indicator content
								</div>
								<div class="flex justify-end">
									<button hlmBtn spartanStepperNext>Next</button>
								</div>
							</div>
						</spartan-step>
						<spartan-step label="Address">
							<div class="flex flex-col gap-4">
								<div
									class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
								>
									Number indicator content
								</div>
								<div class="flex justify-between gap-2">
									<button hlmBtn variant="outline" spartanStepperPrevious>Back</button>
									<button hlmBtn spartanStepperNext>Next</button>
								</div>
							</div>
						</spartan-step>
						<spartan-step label="Done">
							<div class="flex flex-col gap-4">
								<div
									class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
								>
									Number indicator content
								</div>
								<div class="flex justify-start">
									<button hlmBtn variant="outline" spartanStepperPrevious>Back</button>
								</div>
							</div>
						</spartan-step>
					</spartan-stepper>
				</section>

				<section class="flex flex-col gap-4 rounded-xl border p-5">
					<header class="space-y-1">
						<h3 class="font-medium">State</h3>
						<p class="text-muted-foreground text-sm">Default Material-like state icons for completion and errors.</p>
					</header>

					<spartan-stepper indicatorMode="state">
						<spartan-step label="Profile">
							<div class="flex flex-col gap-4">
								<div
									class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
								>
									State indicator content
								</div>
								<div class="flex justify-end">
									<button hlmBtn spartanStepperNext>Next</button>
								</div>
							</div>
						</spartan-step>
						<spartan-step label="Address">
							<div class="flex flex-col gap-4">
								<div
									class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
								>
									State indicator content
								</div>
								<div class="flex justify-between gap-2">
									<button hlmBtn variant="outline" spartanStepperPrevious>Back</button>
									<button hlmBtn spartanStepperNext>Next</button>
								</div>
							</div>
						</spartan-step>
						<spartan-step label="Done">
							<div class="flex flex-col gap-4">
								<div
									class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
								>
									State indicator content
								</div>
								<div class="flex justify-start">
									<button hlmBtn variant="outline" spartanStepperPrevious>Back</button>
								</div>
							</div>
						</spartan-step>
					</spartan-stepper>
				</section>

				<section class="flex flex-col gap-4 rounded-xl border p-5">
					<header class="space-y-1">
						<h3 class="font-medium">Icon</h3>
						<p class="text-muted-foreground text-sm">
							Per-step icons only when
							<code class="text-foreground font-mono">indicatorMode="icon"</code>
							is enabled.
						</p>
					</header>

					<spartan-stepper indicatorMode="icon">
						<spartan-step label="Profile" icon="lucideUser">
							<div class="flex flex-col gap-4">
								<div
									class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
								>
									Icon indicator content
								</div>
								<div class="flex justify-end">
									<button hlmBtn spartanStepperNext>Next</button>
								</div>
							</div>
						</spartan-step>
						<spartan-step label="Address" icon="lucideMapPin">
							<div class="flex flex-col gap-4">
								<div
									class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
								>
									Icon indicator content
								</div>
								<div class="flex justify-between gap-2">
									<button hlmBtn variant="outline" spartanStepperPrevious>Back</button>
									<button hlmBtn spartanStepperNext>Next</button>
								</div>
							</div>
						</spartan-step>
						<spartan-step label="Contact" icon="lucideMail">
							<div class="flex flex-col gap-4">
								<div
									class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
								>
									Icon indicator content
								</div>
								<div class="flex justify-start">
									<button hlmBtn variant="outline" spartanStepperPrevious>Back</button>
								</div>
							</div>
						</spartan-step>
					</spartan-stepper>
				</section>
			</div>
		</div>
	`,
})
export default class StepperIndicatorsPage {}
