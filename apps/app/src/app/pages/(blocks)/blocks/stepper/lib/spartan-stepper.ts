import { CdkStep, CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, input, numberAttribute, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { hlm } from '@spartan-ng/helm/utils';
import { cva } from 'class-variance-authority';
import { tap } from 'rxjs/operators';
import { SpartanStep } from './spartan-step';
import { SpartanStepHeader, SpartanStepperIndicatorMode } from './spartan-step-header';
import { injectSpartanStepperConfig } from './stepper.token';

export type SpartanStepperLabelPosition = 'end' | 'bottom';
export type SpartanStepperHeaderPosition = 'top' | 'bottom';

const stepTransition = cva('', {
	variants: {
		motion: {
			none: '',
			'enter-forward': 'animate-in fade-in slide-in-from-right-8 fill-mode-both',
			'enter-backward': 'animate-in fade-in slide-in-from-left-8 fill-mode-both',
			'leave-forward': 'animate-out fade-out slide-out-to-left-8 fill-mode-both absolute top-0 right-0 left-0',
			'leave-backward': 'animate-out fade-out slide-out-to-right-8 fill-mode-both absolute top-0 right-0 left-0',
			'enter-bottom':
				'animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-400 [animation-timing-function:cubic-bezier(0.34,1.56,0.64,1)]',
		},
	},
	defaultVariants: { motion: 'none' },
});

@Component({
	selector: 'spartan-stepper',
	imports: [CdkStepperModule, NgTemplateOutlet, SpartanStepHeader],
	providers: [{ provide: CdkStepper, useExisting: SpartanStepper }],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@switch (orientation) {
			@case ('horizontal') {
				<div class="flex w-full flex-col gap-6">
					@if (headerPosition() === 'top') {
						<ng-container [ngTemplateOutlet]="horizontalStepsTemplate" [ngTemplateOutletContext]="{ steps: steps }" />
						<ng-container [ngTemplateOutlet]="horizontalPanelTemplate" />
					} @else {
						<ng-container [ngTemplateOutlet]="horizontalPanelTemplate" />
						<ng-container [ngTemplateOutlet]="horizontalStepsTemplate" [ngTemplateOutletContext]="{ steps: steps }" />
					}
				</div>
			}

			@case ('vertical') {
				<div class="flex w-full flex-col gap-3">
					@for (step of steps; track step; let i = $index) {
						<div class="flex flex-col gap-2">
							<ng-container [ngTemplateOutlet]="stepHeaderTemplate" [ngTemplateOutletContext]="{ step: step }" />

							<div
								class="grid grid-rows-[0fr]"
								[class.grid-rows-[1fr]]="selectedIndex === i"
								[class.transition-[grid-template-rows]]="animationsEnabled()"
								[style.transition-duration.ms]="animationDuration()"
							>
								<section
									[class]="_verticalStepClass(!$last, i)"
									role="region"
									[id]="_getStepContentId(i)"
									[attr.aria-labelledby]="_getStepLabelId(i)"
								>
									<ng-container [ngTemplateOutlet]="step.content" />
								</section>
							</div>

							@if (!$last) {
								<div class="ms-4 h-6 w-px" aria-hidden="true">
									<span
										class="block h-full w-px transition-colors duration-200 motion-reduce:transition-none"
										[class.bg-primary]="step.index() < selectedIndex"
										[class.bg-border]="step.index() >= selectedIndex"
									></span>
								</div>
							}
						</div>
					}
				</div>
			}
		}

		<ng-template #stepHeaderTemplate let-step="step">
			<spartan-step-header
				cdkStepHeader
				class="min-w-0"
				(click)="step.select()"
				(keydown)="_onKeydown($event)"
				[tabIndex]="_getFocusIndex() === step.index() ? 0 : -1"
				[id]="_getStepLabelId(step.index())"
				[attr.role]="orientation === 'horizontal' ? 'tab' : 'button'"
				[attr.aria-posinset]="orientation === 'horizontal' ? step.index() + 1 : null"
				[attr.aria-setsize]="orientation === 'horizontal' ? steps.length : null"
				[attr.aria-selected]="orientation === 'horizontal' ? step.isSelected() : null"
				[attr.aria-current]="orientation === 'vertical' && step.isSelected() ? 'step' : null"
				[attr.aria-expanded]="orientation === 'vertical' ? step.isSelected() : null"
				[attr.aria-controls]="_getStepContentId(step.index())"
				[attr.aria-label]="step.ariaLabel || null"
				[attr.aria-labelledby]="!step.ariaLabel && step.ariaLabelledby ? step.ariaLabelledby : null"
				[attr.aria-disabled]="!step.isNavigable() || (orientation === 'vertical' && step.isSelected()) ? 'true' : null"
				[index]="step.index()"
				[state]="step.indicatorType()"
				[label]="step.stepLabelContent() || step.label"
				[selected]="step.isSelected()"
				[reached]="step.index() < selectedIndex"
				[active]="step.isNavigable()"
				[optional]="step.optional"
				[errorMessage]="step.errorMessage"
				[disabled]="linear && !step.isNavigable()"
				[labelPosition]="orientation === 'horizontal' ? labelPosition() : 'end'"
				[indicatorMode]="indicatorMode()"
				[icon]="stepIcon(step)"
			/>
		</ng-template>

		<ng-template #horizontalStepsTemplate let-steps="steps">
			<ol
				class="flex w-full items-center"
				role="tablist"
				aria-orientation="horizontal"
				[attr.aria-label]="stepperAriaLabelledby() ? null : (stepperAriaLabel() ?? null)"
				[attr.aria-labelledby]="stepperAriaLabelledby()"
			>
				@for (step of steps; track step) {
					<li class="flex min-w-0 items-center">
						<ng-container [ngTemplateOutlet]="stepHeaderTemplate" [ngTemplateOutletContext]="{ step: step }" />
					</li>

					@if (!$last) {
						<li class="mx-3 flex min-w-8 flex-1 items-center" aria-hidden="true">
							<span class="bg-border relative h-px w-full overflow-hidden rounded">
								<span
									class="bg-primary absolute inset-y-0 inset-s-0 transition-[width] duration-200"
									[style.width.%]="step.index() < selectedIndex ? 100 : 0"
								></span>
							</span>
						</li>
					}
				}
			</ol>
		</ng-template>

		<ng-template #horizontalPanelTemplate>
			<div class="relative min-h-0 overflow-hidden">
				@for (activeIndex of [selectedIndex]; track activeIndex) {
					<section
						role="tabpanel"
						[id]="_getStepContentId(activeIndex)"
						[attr.aria-labelledby]="_getStepLabelId(activeIndex)"
						[style.animation-duration.ms]="animationDuration()"
						[animate.enter]="animationsEnabled() ? _enterAnimationClass() : ''"
						[animate.leave]="animationsEnabled() ? _leaveAnimationClass() : ''"
					>
						<ng-container [ngTemplateOutlet]="steps.get(activeIndex)?.content" />
					</section>
				}
			</div>
		</ng-template>
	`,
})
export class SpartanStepper extends CdkStepper {
	private readonly _config = injectSpartanStepperConfig();

	public readonly labelPosition = input<SpartanStepperLabelPosition>('end');
	public readonly headerPosition = input<SpartanStepperHeaderPosition>('top');
	public readonly indicatorMode = input<SpartanStepperIndicatorMode>('state');
	public readonly stepperAriaLabel = input<string | null>('Progress');
	public readonly stepperAriaLabelledby = input<string | null>(null);
	public readonly animationsEnabled = input(this._config.animationEnabled, { transform: booleanAttribute });
	public readonly animationDuration = input(this._config.animationDuration, { transform: numberAttribute });

	protected readonly _animationDirection = signal<'forward' | 'backward'>('forward');
	protected readonly _hasSelectionChanged = signal(false);

	constructor() {
		super();

		this.selectionChange
			.pipe(
				tap((event) => {
					if (event.previouslySelectedIndex >= 0 && event.selectedIndex !== event.previouslySelectedIndex) {
						this._hasSelectionChanged.set(true);
					}
					this._animationDirection.set(event.selectedIndex < event.previouslySelectedIndex ? 'backward' : 'forward');
				}),
				takeUntilDestroyed(),
			)
			.subscribe();
	}

	override next(): void {
		this.selected?.stepControl?.markAllAsTouched();
		this.selected?.stepControl?.updateValueAndValidity();

		if (this.linear && this.selected?.stepControl?.invalid) {
			return;
		}

		super.next();
	}

	protected stepIcon(step: CdkStep): string | null {
		return step instanceof SpartanStep ? step.icon() : null;
	}

	protected _enterAnimationClass(): string {
		if (!this._hasSelectionChanged()) {
			return '';
		}
		return stepTransition({ motion: this._animationDirection() === 'forward' ? 'enter-forward' : 'enter-backward' });
	}

	protected _leaveAnimationClass(): string {
		if (!this._hasSelectionChanged()) {
			return '';
		}
		return stepTransition({ motion: this._animationDirection() === 'forward' ? 'leave-forward' : 'leave-backward' });
	}

	protected _verticalStepClass(showConnector: boolean, index: number): string {
		return hlm(
			'ms-4 overflow-hidden ps-6',
			showConnector && 'border-s',
			this.animationsEnabled() && this.selectedIndex === index && stepTransition({ motion: 'enter-bottom' }),
		);
	}
}
