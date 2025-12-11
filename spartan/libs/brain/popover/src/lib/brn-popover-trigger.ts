import { Directive, effect, ElementRef, inject, input, untracked } from '@angular/core';
import { BrnDialogTrigger } from '@spartan-ng/brain/dialog';
import type { BrnPopover } from './brn-popover';

@Directive({
	selector: 'button[brnPopoverTrigger],button[brnPopoverTriggerFor]',
	host: {
		'[id]': 'id()',
		'aria-haspopup': 'dialog',
		'[attr.aria-expanded]': "state() === 'open' ? 'true': 'false'",
		'[attr.data-state]': 'state()',
		'[attr.aria-controls]': 'dialogId',
		'[type]': 'type()',
	},
})
export class BrnPopoverTrigger extends BrnDialogTrigger {
	private readonly _host = inject(ElementRef, { host: true });

	public readonly brnPopoverTriggerFor = input<BrnPopover | undefined>(undefined, {
		alias: 'brnPopoverTriggerFor',
	});

	constructor() {
		super();
		effect(() => {
			const brnDialog = this.brnPopoverTriggerFor();
			untracked(() => {
				if (!brnDialog) return;
				brnDialog.mutableAttachTo.set(this._host.nativeElement);
				brnDialog.mutableCloseOnOutsidePointerEvents.set(true);
				this.mutableBrnDialogTriggerFor().set(brnDialog);
			});
		});

		if (!this._brnDialog) return;
		this._brnDialog.mutableAttachTo.set(this._host.nativeElement);
		this._brnDialog.mutableCloseOnOutsidePointerEvents.set(true);
	}
}
