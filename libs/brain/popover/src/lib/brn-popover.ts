import { type NumberInput } from '@angular/cdk/coercion';
import { type FlexibleConnectedPositionStrategy } from '@angular/cdk/overlay';
import { DestroyRef, Directive, effect, forwardRef, inject, input, numberAttribute, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BrnDialog, type BrnDialogDefaultOptions, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';
import { resolveConnectedSide } from './brn-popover-position';
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
	private readonly _popoverDestroyRef = inject(DestroyRef);

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
					// Track which side CDK actually places the overlay on so the content can
					// slide in from the trigger's edge (matches the reference directional enter).
					this._positionStrategy.positionChanges
						.pipe(takeUntilDestroyed(this._popoverDestroyRef))
						.subscribe((change) => this.setResolvedSide(resolveConnectedSide(change.connectionPair)));
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
