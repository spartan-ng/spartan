import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { SpartanStepperHeaderPosition, SpartanStepperImports, SpartanStepperLabelPosition } from '../../../(blocks)/blocks/stepper/lib';

@Component({
	selector: 'spartan-stepper-layout',
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
				<div class="mb-4 flex flex-wrap items-center gap-2">
					<button hlmBtn variant="outline" size="sm" (click)="updateLabelPosition()">
						Label Position: {{ _labelPosition() }}
					</button>

					<button hlmBtn variant="outline" size="sm" (click)="updateHeaderPosition()">
						Header Position: {{ _headerPosition() }}
					</button>
				</div>

				<spartan-stepper [labelPosition]="_labelPosition()" [headerPosition]="_headerPosition()">
					<spartan-step label="Overview">
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
								<button hlmBtn spartanStepperNext>Next</button>
							</div>
						</div>
					</spartan-step>

					<spartan-step label="Preferences" optional>
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								<p class="text-muted-foreground max-w-sm text-center text-sm">
									Horizontal headers can move above or below the content panel, and labels can sit beside the indicator
									or below it.
								</p>
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
								<p class="text-muted-foreground max-w-sm text-center text-sm">
									The layout options can be used in combination to create a variety of stepper designs to fit your
									application's needs.
								</p>
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
export default class StepperLayoutPage {
	protected readonly _labelPosition = signal<SpartanStepperLabelPosition>('end');
	protected readonly _headerPosition = signal<SpartanStepperHeaderPosition>('top');

	updateLabelPosition() {
		this._labelPosition.set(this._labelPosition() === 'end' ? 'bottom' : 'end');
	}

	updateHeaderPosition() {
		this._headerPosition.set(this._headerPosition() === 'top' ? 'bottom' : 'top');
	}
}
