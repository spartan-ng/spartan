import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { map } from 'rxjs/operators';
import { SpartanStepperImports } from '../../../(blocks)/blocks/stepper/lib';

@Component({
	selector: 'spartan-stepper-responsive',
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
				<spartan-stepper [orientation]="_orientation()" stepperAriaLabel="Responsive campaign setup steps">
					<spartan-step label="Campaign">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								<p class="text-muted-foreground max-w-sm text-center text-sm">
									This example switches to vertical orientation below 768px.
								</p>
							</div>
							<div class="flex justify-end">
								<button hlmBtn spartanStepperNext>Next</button>
							</div>
						</div>
					</spartan-step>

					<spartan-step label="Audience">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								<p class="text-muted-foreground max-w-sm text-center text-sm">
									Current orientation:
									<code class="text-foreground font-mono">{{ _orientation() }}</code>
								</p>
							</div>
							<div class="flex justify-between gap-2">
								<button hlmBtn variant="outline" spartanStepperPrevious>Back</button>
								<button hlmBtn spartanStepperNext>Next</button>
							</div>
						</div>
					</spartan-step>

					<spartan-step label="Review">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								<p class="text-muted-foreground max-w-sm text-center text-sm">
									Resize the viewport to see the layout change.
								</p>
							</div>
							<div class="flex justify-between gap-2">
								<button hlmBtn variant="outline" spartanStepperPrevious>Back</button>
								<button hlmBtn>Publish</button>
							</div>
						</div>
					</spartan-step>
				</spartan-stepper>
			</div>
		</div>
	`,
})
export default class StepperResponsivePage {
	private readonly _breakpointObserver = inject(BreakpointObserver);

	private readonly _isSmallScreen = toSignal(
		this._breakpointObserver.observe('(max-width: 767.98px)').pipe(map((state) => state.matches)),
		{ initialValue: false },
	);

	protected readonly _orientation = computed<StepperOrientation>(() =>
		this._isSmallScreen() ? 'vertical' : 'horizontal',
	);
}
