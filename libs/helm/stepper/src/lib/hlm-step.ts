import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { CdkStep } from '@angular/cdk/stepper';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  ContentChild,
  DestroyRef,
  effect,
  inject,
  input,
  untracked,
  ViewContainerRef,
} from '@angular/core';
import { HlmStepContent } from './hlm-step-content';
import { HlmStepLabel } from './hlm-step-label';

@Component({
  selector: 'hlm-step',
  template: `
    <ng-template>
      <ng-content></ng-content>
      <ng-template [cdkPortalOutlet]="_portal"></ng-template>
    </ng-template>
  `,
  providers: [
    {
      provide: CdkStep,
      useExisting: HlmStep,
    },
  ],
  exportAs: 'hlmStep',
  host: {
    hidden: '',
  },
  imports: [CdkPortalOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmStep extends CdkStep {
  private readonly _viewContainerRef = inject(ViewContainerRef);
  private readonly _destroyRef = inject(DestroyRef);

  readonly icon = input<string | null>(null);

  /** Content for step label given by `<ng-template hlmStepLabel>`. */
  @ContentChild(HlmStepLabel) override stepLabel: HlmStepLabel = undefined!;

  /** Content that will be rendered lazily. */
  private readonly _lazyContent = contentChild(HlmStepContent);

  /** Currently-attached portal containing the lazy content. */
  _portal: TemplatePortal | null = null;

  constructor() {
    super();

    effect(() => {
      const isSelected = this.isSelected();
      const lazyContent = this._lazyContent();

      untracked(() => {
        if (isSelected && lazyContent && !this._portal) {
          this._portal = new TemplatePortal(lazyContent._template, this._viewContainerRef);
        }
      });
    });

    this._destroyRef.onDestroy(() => {
      if (this._portal?.isAttached) {
        this._portal.detach();
      }
    });
  }
}
