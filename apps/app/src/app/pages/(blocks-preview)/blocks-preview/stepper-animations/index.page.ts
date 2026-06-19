import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { SpartanStepperImports } from '../../../(blocks)/blocks/stepper/lib';

@Component({
	selector: 'spartan-stepper-animations',
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
				<div class="mb-4 flex flex-col gap-3">
					<div class="flex flex-wrap items-center gap-2">
						<button hlmBtn variant="outline" size="sm" (click)="toggleAnimations()">
							{{ _animationsEnabled() ? 'Disable animations' : 'Enable animations' }}
						</button>
						<span class="text-muted-foreground text-sm">Duration: {{ _animationDuration() }}ms</span>
					</div>

					<input
						class="accent-primary w-full"
						type="range"
						min="0"
						max="1000"
						step="50"
						[value]="_animationDuration()"
						(input)="setAnimationDuration($event)"
					/>
				</div>

				<spartan-stepper [animationsEnabled]="_animationsEnabled()" [animationDuration]="_animationDuration()">
					<spartan-step label="Account">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-center text-sm"
							>
								Toggle animations and adjust duration to preview step transitions.
							</div>
							<div class="flex justify-end">
								<button hlmBtn spartanStepperNext>Next</button>
							</div>
						</div>
					</spartan-step>

					<spartan-step label="Profile">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-center text-sm"
							>
								These controls use the stepper inputs:
								<code class="text-foreground font-mono">animationsEnabled</code>
								and
								<code class="text-foreground font-mono">animationDuration</code>
								.
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
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-center text-sm"
							>
								Use global defaults via
								<code class="text-foreground font-mono">provideHlmStepperConfig</code>
								and override per instance with inputs when needed.
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
export default class StepperAnimationsPage {
	protected readonly _animationsEnabled = signal(true);
	protected readonly _animationDuration = signal(300);

	protected toggleAnimations(): void {
		this._animationsEnabled.update((enabled) => !enabled);
	}

	protected setAnimationDuration(event: Event): void {
		const target = event.target as HTMLInputElement | null;
		const parsed = Number.parseInt(target?.value ?? '', 10);
		this._animationDuration.set(Number.isFinite(parsed) ? parsed : 300);
	}
}
