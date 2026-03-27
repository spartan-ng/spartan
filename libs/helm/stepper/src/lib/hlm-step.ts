import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { CdkStep } from '@angular/cdk/stepper';
import {
	ChangeDetectionStrategy,
	Component,
	contentChild,
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
	exportAs: 'hlmStep',
	imports: [CdkPortalOutlet],
	providers: [
		{
			provide: CdkStep,
			useExisting: HlmStep,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		hidden: '',
	},
	template: `
		<ng-template>
			<ng-content></ng-content>
			<ng-template [cdkPortalOutlet]="portal"></ng-template>
		</ng-template>
	`,
})
export class HlmStep extends CdkStep {
	private readonly _viewContainerRef = inject(ViewContainerRef);
	private readonly _destroyRef = inject(DestroyRef);

	public readonly icon = input<string | null>(null);

	/** Content for step label given by `<ng-template hlmStepLabel>`. */
	public readonly stepLabelContent = contentChild(HlmStepLabel);

	/** Content that will be rendered lazily. */
	private readonly _lazyContent = contentChild(HlmStepContent);

	/** Currently-attached portal containing the lazy content. */
	public portal: TemplatePortal | null = null;

	constructor() {
		super();

		effect(() => {
			const isSelected = this.isSelected();
			const lazyContent = this._lazyContent();

			untracked(() => {
				if (isSelected && lazyContent && !this.portal) {
					this.portal = new TemplatePortal(lazyContent.template, this._viewContainerRef);
				}
			});
		});

		this._destroyRef.onDestroy(() => {
			if (this.portal?.isAttached) {
				this.portal.detach();
			}
		});
	}
}
