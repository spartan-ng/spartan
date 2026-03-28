import { CdkStep, CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, input, numberAttribute, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/operators';
import { HlmStep } from './hlm-step';
import { HlmStepHeader, HlmStepperIndicatorMode } from './hlm-step-header';
import { injectHlmStepperConfig } from './stepper.token';

export type HlmLabelPosition = 'end' | 'bottom';
export type HlmHeaderPosition = 'top' | 'bottom';

@Component({
	selector: 'hlm-stepper',
	imports: [CdkStepperModule, NgTemplateOutlet, HlmStepHeader],
	providers: [{ provide: CdkStepper, useExisting: HlmStepper }],
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
									class="ms-4 overflow-hidden ps-6"
									[class.border-s]="!$last"
									[class.step-enter-bottom]="animationsEnabled() && selectedIndex === i"
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
			<hlm-step-header
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
export class HlmStepper extends CdkStepper {
	private readonly _config = injectHlmStepperConfig();

	public readonly labelPosition = input<HlmLabelPosition>('end');
	public readonly headerPosition = input<HlmHeaderPosition>('top');
	public readonly indicatorMode = input<HlmStepperIndicatorMode>('state');
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
		return step instanceof HlmStep ? step.icon() : null;
	}

	protected _enterAnimationClass(): string {
		if (!this._hasSelectionChanged()) {
			return '';
		}
		return this._animationDirection() === 'forward' ? 'step-enter-forward' : 'step-enter-backward';
	}

	protected _leaveAnimationClass(): string {
		if (!this._hasSelectionChanged()) {
			return '';
		}
		return this._animationDirection() === 'forward' ? 'step-leave-forward' : 'step-leave-backward';
	}
}
