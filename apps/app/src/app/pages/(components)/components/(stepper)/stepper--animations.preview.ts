import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmStepperImports } from '@spartan-ng/helm/stepper';

@Component({
	selector: 'spartan-stepper-animations-preview',
	imports: [HlmStepperImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full',
	},
	template: `
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

		<hlm-stepper [animationsEnabled]="_animationsEnabled()" [animationDuration]="_animationDuration()">
			<hlm-step label="Account">
				<div class="flex flex-col gap-4">
					<div
						class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-center text-sm"
					>
						Toggle animations and adjust duration to preview step transitions.
					</div>
					<div class="flex justify-end">
						<button hlmBtn hlmStepperNext>Next</button>
					</div>
				</div>
			</hlm-step>

			<hlm-step label="Profile">
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
						<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
						<button hlmBtn hlmStepperNext>Next</button>
					</div>
				</div>
			</hlm-step>

			<hlm-step label="Review">
				<div class="flex flex-col gap-4">
					<div
						class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-center text-sm"
					>
						Use global defaults via
						<code class="text-foreground font-mono">provideHlmStepperConfig</code>
						and override per instance with inputs when needed.
					</div>
					<div class="flex justify-between gap-2">
						<button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
						<button hlmBtn>Finish</button>
					</div>
				</div>
			</hlm-step>
		</hlm-stepper>
	`,
})
export class StepperAnimationsPreview {
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

export const animationControlsCode = `
import { Component, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmStepperImports } from '@spartan-ng/helm/stepper';

@Component({
  selector: 'my-stepper-animation-controls',
  imports: [HlmStepperImports, HlmButtonImports],
  template: \`
    <button hlmBtn variant="outline" (click)="_animationsEnabled.set(!_animationsEnabled())">
      {{ _animationsEnabled() ? 'Disable animations' : 'Enable animations' }}
    </button>

    <input
      type="range"
      min="0"
      max="1000"
      step="50"
      [value]="_animationDuration()"
      (input)="setAnimationDuration($event)"
    />

    <hlm-stepper [animationsEnabled]="_animationsEnabled()" [animationDuration]="_animationDuration()">
      <!-- steps -->
    </hlm-stepper>
  \`,
})
export class MyStepperAnimationControls {
  protected readonly _animationsEnabled = signal(true);
  protected readonly _animationDuration = signal(300);

  protected setAnimationDuration(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    const parsed = Number.parseInt(target?.value ?? '', 10);
    this._animationDuration.set(Number.isFinite(parsed) ? parsed : 300);
  }
}
`;

export const stepperConfigCode = `
import { ApplicationConfig } from '@angular/core';
import { provideHlmStepperConfig } from '@spartan-ng/helm/stepper';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHlmStepperConfig({
      animationEnabled: true,
      animationDuration: 300,
      defaultIndicatorMode: 'state',
    }),
  ],
};
`;
