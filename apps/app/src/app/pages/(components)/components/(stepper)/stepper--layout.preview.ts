import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmHeaderPosition, HlmLabelPosition, HlmStepperImports } from '@spartan-ng/helm/stepper';

@Component({
	selector: 'spartan-stepper-layout-preview',
	imports: [HlmStepperImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="mb-4 flex flex-wrap items-center gap-2">
			<button
				hlmBtn
				variant="outline"
				size="sm"
				(click)="updateLabelPosition()"
			>
				Label Position: {{ labelPosition() }}
			</button>

			<button
				hlmBtn
				variant="outline"
				size="sm"
				(click)="updateHeaderPosition()"
			>
				Header Position: {{ headerPosition() }}
			</button>
		</div>

		<hlm-stepper [labelPosition]="labelPosition()" [headerPosition]="headerPosition()">
			<hlm-step label="Overview">
				<div class="flex flex-col gap-4">
					<div
						class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
					>
						<p class="text-muted-foreground max-w-sm text-center text-sm">
							This example focuses on the horizontal layout controls:
							<code class="text-foreground font-mono">labelPosition</code>
							and
							<code class="text-foreground font-mono">headerPosition</code>
							.
						</p>
					</div>
					<div class="flex justify-end">
						<button hlmBtn hlmStepperNext>Next</button>
					</div>
				</div>
			</hlm-step>

			<hlm-step label="Preferences" optional>
				<div class="flex flex-col gap-4">
					<div
						class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
					>
						<p class="text-muted-foreground max-w-sm text-center text-sm">
							Horizontal headers can move above or below the content panel, and labels can sit beside the
							indicator or below it.
						</p>
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
						<p class="text-muted-foreground max-w-sm text-center text-sm">
							The layout options can be used in combination to create a variety of stepper designs to fit your
							application's needs.
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
export class StepperLayoutPreview {
	protected readonly labelPosition = signal<HlmLabelPosition>('end');
	protected readonly headerPosition = signal<HlmHeaderPosition>('top');

	updateLabelPosition() {
		this.labelPosition.set(this.labelPosition() === 'end' ? 'bottom' : 'end');
	}

	updateHeaderPosition() {
		this.headerPosition.set(this.headerPosition() === 'top' ? 'bottom' : 'top');
	}
}

