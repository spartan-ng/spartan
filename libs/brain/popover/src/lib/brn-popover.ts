import { type NumberInput } from '@angular/cdk/coercion';
import { type FlexibleConnectedPositionStrategy } from '@angular/cdk/overlay';
import { Directive, effect, forwardRef, input, numberAttribute, untracked } from '@angular/core';
import { BrnDialog, type BrnDialogDefaultOptions, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';
import { BrnPopoverAlign, injectBrnPopoverConfig } from './brn-popover.token';

export const BRN_POPOVER_DIALOG_DEFAULT_OPTIONS: Partial<BrnDialogDefaultOptions> = {
	hasBackdrop: false,
	scrollStrategy: 'reposition',
};

@Directive({
	selector: '[brnPopover],brn-popover',
	exportAs: 'brnPopover',
	providers: [
		{
			provide: BrnDialog,
			useExisting: forwardRef(() => BrnPopover),
		},
		provideBrnDialogDefaultOptions(BRN_POPOVER_DIALOG_DEFAULT_OPTIONS),
	],
})
export class BrnPopover extends BrnDialog {
	private readonly _config = injectBrnPopoverConfig();

	public readonly align = input<BrnPopoverAlign>(this._config.align);
	public readonly sideOffset = input<number, NumberInput>(this._config.sideOffset, { transform: numberAttribute });
	public readonly offsetX = input<number, NumberInput>(this._config.offsetX, { transform: numberAttribute });
	private _positionStrategy?: FlexibleConnectedPositionStrategy;

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
		effect(() => {
			const attachTo = this.mutableAttachTo();
			const positions = this.mutableAttachPositions();
			if (!attachTo || !positions || positions.length === 0) return;
			untracked(() => {
				if (!this._positionStrategy) {
					this._positionStrategy = this.positionBuilder.flexibleConnectedTo(attachTo).withPush(false);
				} else {
					this._positionStrategy.setOrigin(attachTo);
				}
				this._positionStrategy.withPositions(positions);
				this.mutablePositionStrategy.set(this._positionStrategy);
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
