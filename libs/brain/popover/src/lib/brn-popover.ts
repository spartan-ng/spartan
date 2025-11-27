import {
	ChangeDetectionStrategy,
	Component,
	effect,
	forwardRef,
	input,
	numberAttribute,
	untracked,
} from '@angular/core';
import { BrnDialog, type BrnDialogDefaultOptions, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';

export const BRN_POPOVER_DIALOG_DEFAULT_OPTIONS: Partial<BrnDialogDefaultOptions> = {
	hasBackdrop: false,
	scrollStrategy: 'reposition',
	positionStrategy: null,
};

export type BrnPopoverAlign = 'start' | 'center' | 'end';

@Component({
	selector: 'brn-popover',
	exportAs: 'brnPopover',
	providers: [
		{
			provide: BrnDialog,
			useExisting: forwardRef(() => BrnPopover),
		},
		provideBrnDialogDefaultOptions(BRN_POPOVER_DIALOG_DEFAULT_OPTIONS),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ng-content />
	`,
})
export class BrnPopover extends BrnDialog {
	public readonly align = input<BrnPopoverAlign>('center');
	public readonly sideOffset = input(0, { transform: numberAttribute });
	public readonly offsetX = input(0, { transform: numberAttribute });

	constructor() {
		super();
		this.setAriaDescribedBy('');
		this.setAriaLabelledBy('');

		effect(() => {
			const align = this.align();
			untracked(() => {
				this.mutableAttachPositions.set([
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
		effect(() => {
			const offsetX = this.offsetX();
			untracked(() => {
				this.applyOffsetX(offsetX);
			});
		});
	}

	private applySideOffset(sideOffset: number) {
		this.mutableAttachPositions.update((positions) =>
			positions.map((position) => ({
				...position,
				offsetY: position.originY === 'top' ? -sideOffset : sideOffset,
			})),
		);
	}
	private applyOffsetX(offsetX: number) {
		this.mutableAttachPositions.update((positions) =>
			positions.map((position) => ({
				...position,
				offsetX,
			})),
		);
	}
}
