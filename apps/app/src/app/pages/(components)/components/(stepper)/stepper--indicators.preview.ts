import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideMail, lucideMapPin, lucideUser } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmStepperImports } from '@spartan-ng/helm/stepper';

@Component({selector: 'spartan-stepper-indicators-preview',
imports: [HlmStepperImports, HlmButtonImports],
providers: [provideIcons({ lucideUser, lucideMapPin, lucideMail })],
changeDetection: ChangeDetectionStrategy.OnPush,
host: {
		class: 'w-full',
	},
template: `
		<div class="space-y-6">
			<section class="flex flex-col gap-4 rounded-xl border p-5">
				<header class="space-y-1">
					<h3 class="font-medium">Number</h3>
					<p class="text-sm text-muted-foreground">Always renders 1, 2, 3.</p>
				</header>

				<hlm-stepper indicatorMode="number">
					<hlm-step label="Profile">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								Number indicator content
							</div>
							<div class="flex justify-end">
								<button hlmBtn hlmStepperNext>Next</button>
							</div>
						</div>
					</hlm-step>
					<hlm-step label="Address">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								Number indicator content
							</div>
							<div class="flex justify-between gap-2">
								<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
								<button hlmBtn hlmStepperNext>Next</button>
							</div>
						</div>
					</hlm-step>
					<hlm-step label="Done">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								Number indicator content
							</div>
							<div class="flex justify-start">
								<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
							</div>
						</div>
					</hlm-step>
				</hlm-stepper>
			</section>

			<section class="flex flex-col gap-4 rounded-xl border p-5">
				<header class="space-y-1">
					<h3 class="font-medium">State</h3>
					<p class="text-sm text-muted-foreground">
						Default Material-like state icons for completion and errors.
					</p>
				</header>

				<hlm-stepper indicatorMode="state">
					<hlm-step label="Profile">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								State indicator content
							</div>
							<div class="flex justify-end">
								<button hlmBtn hlmStepperNext>Next</button>
							</div>
						</div>
					</hlm-step>
					<hlm-step label="Address">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								State indicator content
							</div>
							<div class="flex justify-between gap-2">
								<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
								<button hlmBtn hlmStepperNext>Next</button>
							</div>
						</div>
					</hlm-step>
					<hlm-step label="Done">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								State indicator content
							</div>
							<div class="flex justify-start">
								<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
							</div>
						</div>
					</hlm-step>
				</hlm-stepper>
			</section>

			<section class="flex flex-col gap-4 rounded-xl border p-5">
				<header class="space-y-1">
					<h3 class="font-medium">Icon</h3>
					<p class="text-sm text-muted-foreground">
						Per-step icons only when
						<code class="text-foreground font-mono">indicatorMode="icon"</code>
						is enabled.
					</p>
				</header>

				<hlm-stepper indicatorMode="icon">
					<hlm-step label="Profile" icon="lucideUser">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								Icon indicator content
							</div>
							<div class="flex justify-end">
								<button hlmBtn hlmStepperNext>Next</button>
							</div>
						</div>
					</hlm-step>
					<hlm-step label="Address" icon="lucideMapPin">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								Icon indicator content
							</div>
							<div class="flex justify-between gap-2">
								<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
								<button hlmBtn hlmStepperNext>Next</button>
							</div>
						</div>
					</hlm-step>
					<hlm-step label="Contact" icon="lucideMail">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								Icon indicator content
							</div>
							<div class="flex justify-start">
								<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
							</div>
						</div>
					</hlm-step>
				</hlm-stepper>
			</section>
		</div>
	`})
export class StepperStatesPreview {}

