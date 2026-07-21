import { type NumberInput } from '@angular/cdk/coercion';
import { type ConnectedPosition } from '@angular/cdk/overlay';
import { isPlatformServer } from '@angular/common';
import {
	Directive,
	effect,
	ElementRef,
	forwardRef,
	inject,
	input,
	numberAttribute,
	PLATFORM_ID,
	signal,
} from '@angular/core';
import {
	BrnOverlay,
	type BrnOverlayDefaultOptions,
	type BrnOverlayOptions,
	provideBrnOverlayDefaultOptions,
} from '@spartan-ng/brain/overlay';
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
	private readonly _platformId = inject(PLATFORM_ID);

	public readonly align = input<BrnPopoverAlign>(this._config.align);
	public readonly sideOffset = input<number, NumberInput>(this._config.sideOffset, { transform: numberAttribute });
	public readonly offsetX = input<number, NumberInput>(this._config.offsetX, { transform: numberAttribute });

	private readonly _triggerWidth = signal<number | null>(null);

	public readonly triggerWidth = this._triggerWidth.asReadonly();

	constructor() {
		super();

		if (isPlatformServer(this._platformId)) return;

		effect((onCleanup) => {
			if (this.stateComputed() !== 'open') return;

			const element = this._resolveOriginElement(this.getAttachTo());
			if (!element) return;

			this._triggerWidth.set(element.getBoundingClientRect().width);

			const observer = new ResizeObserver(() => this._triggerWidth.set(element.getBoundingClientRect().width));
			observer.observe(element, { box: 'border-box' });
			onCleanup(() => observer.disconnect());
		});
	}

	private _resolveOriginElement(origin: BrnOverlayOptions['attachTo']): Element | null {
		if (origin instanceof ElementRef) return origin.nativeElement;
		if (origin instanceof Element) return origin;
		return null;
	}

	protected override getDefaultOptions(): BrnOverlayDefaultOptions {
		return injectBrnPopoverDefaultOptions();
	}

	protected override getAttachPositions(): ConnectedPosition[] {
		const align = this.align();
		const sideOffset = this.sideOffset();
		const offsetX = this.offsetX();
		return [
			{
				originX: align,
				originY: 'bottom',
				overlayX: align,
				overlayY: 'top',
				offsetX,
				offsetY: sideOffset,
			},
			{
				originX: align,
				originY: 'top',
				overlayX: align,
				overlayY: 'bottom',
				offsetX,
				offsetY: -sideOffset,
			},
		];
	}

	protected override getPositionStrategy() {
		const attachTo = this.getAttachTo();
		if (!attachTo) return super.getPositionStrategy();
		return this._positionBuilder.flexibleConnectedTo(attachTo).withPositions(this.getAttachPositions()).withPush(false);
	}
}
