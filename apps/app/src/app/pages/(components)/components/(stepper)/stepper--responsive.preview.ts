import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmStepperImports } from '@spartan-ng/helm/stepper';
import { map } from 'rxjs/operators';

@Component({
	selector: 'spartan-stepper-responsive-preview',
	imports: [HlmStepperImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full',
	},
	template: `
		<hlm-stepper [orientation]="_orientation()" stepperAriaLabel="Responsive campaign setup steps">
			<hlm-step label="Campaign">
				<div class="flex flex-col gap-4">
					<div
						class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
					>
						<p class="text-muted-foreground max-w-sm text-center text-sm">
							This example switches to vertical orientation below 768px.
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
							Current orientation:
							<code class="text-foreground font-mono">{{ _orientation() }}</code>
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
							Resize the viewport to see the layout change.
						</p>
					</div>
					<div class="flex justify-between gap-2">
						<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
						<button hlmBtn>Publish</button>
					</div>
				</div>
			</hlm-step>
		</hlm-stepper>
	`,
})
export class StepperResponsivePreview {
	private readonly _breakpointObserver = inject(BreakpointObserver);

	private readonly _isSmallScreen = toSignal(
		this._breakpointObserver.observe('(max-width: 767.98px)').pipe(map((state) => state.matches)),
		{ initialValue: false },
	);

	protected readonly _orientation = computed<StepperOrientation>(() =>
		this._isSmallScreen() ? 'vertical' : 'horizontal',
	);
}
