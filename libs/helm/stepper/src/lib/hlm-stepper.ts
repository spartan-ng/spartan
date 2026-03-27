import { CdkStep, CdkStepHeader, CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, QueryList, ViewChildren, input } from '@angular/core';
import { HlmStep } from './hlm-step';
import { HlmStepHeader, HlmStepperIndicatorMode } from './hlm-step-header';

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
            <ng-container
              [ngTemplateOutlet]="horizontalStepsTemplate"
              [ngTemplateOutletContext]="{ steps: steps }"
            />
            <ng-container [ngTemplateOutlet]="horizontalPanelTemplate" />
          } @else {
            <ng-container [ngTemplateOutlet]="horizontalPanelTemplate" />
            <ng-container
              [ngTemplateOutlet]="horizontalStepsTemplate"
              [ngTemplateOutletContext]="{ steps: steps }"
            />
          }
        </div>
      }

      @case ('vertical') {
        <div class="flex w-full flex-col gap-3">
          @for (step of steps; track step; let i = $index) {
            <div class="flex flex-col gap-2">
              <ng-container
                [ngTemplateOutlet]="stepHeaderTemplate"
                [ngTemplateOutletContext]="{ step: step }"
              />

              <div class="min-h-0 overflow-hidden">
                @if (selectedIndex === i) {
                  <section
                    class="ms-4 ps-6"
                    [class.border-s]="!$last"
                    role="region"
                    [id]="_getStepContentId(i)"
                    [attr.aria-labelledby]="_getStepLabelId(i)"
                  >
                    <ng-container [ngTemplateOutlet]="step.content" />
                  </section>
                }
              </div>

              @if (!$last && selectedIndex !== i) {
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
        [attr.aria-disabled]="
          !step.isNavigable() || (orientation === 'vertical' && step.isSelected()) ? 'true' : null
        "
        [index]="step.index()"
        [state]="step.indicatorType()"
        [label]="step.stepLabel || step.label"
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
            <ng-container
              [ngTemplateOutlet]="stepHeaderTemplate"
              [ngTemplateOutletContext]="{ step: step }"
            />
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
      <section
        role="tabpanel"
        [id]="_getStepContentId(selectedIndex)"
        [attr.aria-labelledby]="_getStepLabelId(selectedIndex)"
      >
        <ng-container [ngTemplateOutlet]="selected?.content ?? null" />
      </section>
    </ng-template>
  `,
})
export class HlmStepper extends CdkStepper {
  @ViewChildren(CdkStepHeader) override _stepHeader: QueryList<CdkStepHeader> = undefined!;

  readonly labelPosition = input<HlmLabelPosition>('end');
  readonly headerPosition = input<HlmHeaderPosition>('top');
  readonly indicatorMode = input<HlmStepperIndicatorMode>('state');
  readonly stepperAriaLabel = input<string | null>('Progress');
  readonly stepperAriaLabelledby = input<string | null>(null);

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
}
