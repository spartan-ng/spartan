import { Directive, ElementRef, inject, input } from '@angular/core';
import { type BrnOverlay, BrnOverlayTrigger } from '@spartan-ng/brain/overlay';
import type { BrnPopover } from './brn-popover';

@Directive({
	selector: 'button[brnPopoverTrigger],button[brnPopoverTriggerFor]',
	host: {
		'[id]': 'id()',
		'aria-haspopup': 'dialog',
		'[attr.aria-expanded]': "state() === 'open' ? 'true': 'false'",
		'[attr.data-state]': 'state()',
		'[attr.aria-controls]': 'overlayId()',
		'[type]': 'type()',
	},
})
export class BrnPopoverTrigger extends BrnOverlayTrigger {
	private readonly _host = inject(ElementRef, { host: true });

	public readonly brnPopoverTriggerFor = input<BrnPopover | undefined>(undefined);

	protected override getOverlay(): BrnOverlay | undefined {
		return this.brnPopoverTriggerFor() ?? super.getOverlay();
	}

	public override open(): void {
		const popover = this.getOverlay();
		if (!popover) return;

		popover.mutableAttachTo.set(this._host.nativeElement);
		popover.open();
	}
}
