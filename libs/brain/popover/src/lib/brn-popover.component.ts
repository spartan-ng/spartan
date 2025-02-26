import {
	ChangeDetectionStrategy,
	Component,
	effect,
	forwardRef,
	input,
	numberAttribute,
	untracked,
	ViewEncapsulation,
} from '@angular/core';
import { BrnDialogComponent, BrnDialogDefaultOptions, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';

export const BRN_POPOVER_DIALOG_DEFAULT_OPTIONS: Partial<BrnDialogDefaultOptions> = {
	hasBackdrop: false,
	scrollStrategy: 'reposition',
};

export type BrnPopoverAlign = 'start' | 'center' | 'end';

@Component({
	selector: 'brn-popover',
	standalone: true,
	template: `
		<ng-content />
	`,
	providers: [
		{
			provide: BrnDialogComponent,
			useExisting: forwardRef(() => BrnPopoverComponent),
		},
		provideBrnDialogDefaultOptions(BRN_POPOVER_DIALOG_DEFAULT_OPTIONS),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	exportAs: 'brnPopover',
})
export class BrnPopoverComponent extends BrnDialogComponent {
	public readonly align = input<BrnPopoverAlign>('center');
	public readonly sideOffset = input(0, { transform: numberAttribute });

	constructor() {
		super();
		this.setAriaDescribedBy('');
		this.setAriaLabelledBy('');

		effect(() => {
			const align = this.align();
			untracked(() => {
				this.mutableAttachPositions().set([
					{
						originX: align,
						originY: 'bottom',
						overlayX: align,
						overlayY: 'top',
					},
					{
						originX: align,
						originY: 'top',
						overlayX: align,
						overlayY: 'bottom',
					},
				]);
			});
			untracked(() => {
				this.applySideOffset(this.sideOffset());
			});
		});
		effect(() => {
			const sideOffset = this.sideOffset();
			untracked(() => {
				this.applySideOffset(sideOffset);
			});
		});
	}

	private applySideOffset(sideOffset: number) {
		this.mutableAttachPositions().update((positions) =>
			positions.map((position) => ({
				...position,
				offsetY: position.originY === 'top' ? -sideOffset : sideOffset,
			})),
		);
	}
}
