import { type NumberInput } from '@angular/cdk/coercion';
import { type ConnectedPosition } from '@angular/cdk/overlay';
import { Directive, forwardRef, input, numberAttribute } from '@angular/core';
import { BrnOverlay, type BrnOverlayDefaultOptions, provideBrnOverlayDefaultOptions } from '@spartan-ng/brain/overlay';
import {
	BRN_POPOVER_OVERLAY_DEFAULT_OPTIONS,
	type BrnPopoverAlign,
	injectBrnPopoverConfig,
	injectBrnPopoverDefaultOptions,
} from './brn-popover.token';

/** @deprecated Use `BRN_POPOVER_OVERLAY_DEFAULT_OPTIONS`. */
export const BRN_POPOVER_DIALOG_DEFAULT_OPTIONS = BRN_POPOVER_OVERLAY_DEFAULT_OPTIONS;

@Directive({
	selector: '[brnPopover],brn-popover',
	exportAs: 'brnPopover',
	providers: [
		{
			provide: BrnOverlay,
			useExisting: forwardRef(() => BrnPopover),
		},
		provideBrnOverlayDefaultOptions(BRN_POPOVER_OVERLAY_DEFAULT_OPTIONS),
	],
})
export class BrnPopover extends BrnOverlay {
	private readonly _config = injectBrnPopoverConfig();

	public readonly align = input<BrnPopoverAlign>(this._config.align);
	public readonly sideOffset = input<number, NumberInput>(this._config.sideOffset, { transform: numberAttribute });
	public readonly offsetX = input<number, NumberInput>(this._config.offsetX, { transform: numberAttribute });

	protected override getDefaultOptions(): BrnOverlayDefaultOptions {
		return injectBrnPopoverDefaultOptions();
	}

	protected override getAttachPositions(): ConnectedPosition[] {
		const align = this.align();
		const sideOffset = this.sideOffset();
		const offsetX = this.offsetX();

		const positionsFor = (alignment: BrnPopoverAlign): ConnectedPosition[] => [
			{
				originX: alignment,
				originY: 'bottom',
				overlayX: alignment,
				overlayY: 'top',
				offsetX,
				offsetY: sideOffset,
			},
			{
				originX: alignment,
				originY: 'top',
				overlayX: alignment,
				overlayY: 'bottom',
				offsetX,
				offsetY: -sideOffset,
			},
		];

		// Anchoring to the opposite edge is what keeps content wider than its trigger inside
		// the viewport. Without these, every candidate shares one align axis, the CDK finds
		// none that fits, and it confines the overlay to the gap that is left — which reads as
		// content squeezed to a fraction of its width rather than as content moved.
		const opposite = align === 'start' ? 'end' : align === 'end' ? 'start' : null;
		return opposite ? [...positionsFor(align), ...positionsFor(opposite)] : positionsFor(align);
	}

	protected override getPositionStrategy() {
		const attachTo = this.getAttachTo();
		if (!attachTo) return super.getPositionStrategy();
		// Push stays off, as #955 established: recomputing it on every scroll is what pinned
		// overlays to the viewport in #943. Falling back to another anchor needs no push.
		return this._positionBuilder.flexibleConnectedTo(attachTo).withPositions(this.getAttachPositions()).withPush(false);
	}
}
