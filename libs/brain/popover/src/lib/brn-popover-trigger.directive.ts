import { Directive, ElementRef, effect, inject, input, untracked } from '@angular/core';
import { BrnDialogTriggerDirective } from '@spartan-ng/brain/dialog';
import type { BrnPopoverComponent } from './brn-popover.component';

@Directive({
	selector: 'button[brnPopoverTrigger],button[brnPopoverTriggerFor]',
	standalone: true,
	host: {
		'[id]': 'id()',
		'aria-haspopup': 'dialog',
		'[attr.aria-expanded]': "state() === 'open' ? 'true': 'false'",
		'[attr.data-state]': 'state()',
		'[attr.aria-controls]': 'dialogId',
	},
})
export class BrnPopoverTriggerDirective extends BrnDialogTriggerDirective {
	private readonly _host = inject(ElementRef, { host: true });

	public readonly brnPopoverTriggerFor = input<BrnPopoverComponent | undefined>(undefined, {
		alias: 'brnPopoverTriggerFor',
	});

	constructor() {
		super();
		if (!this._brnDialog) return;
		this._brnDialog.mutableAttachTo().set(this._host.nativeElement);
		this._brnDialog.mutableCloseOnOutsidePointerEvents().set(true);

		effect(() => {
			const brnDialog = this.brnPopoverTriggerFor();
			untracked(() => {
				if (!brnDialog) return;
				brnDialog.mutableAttachTo().set(this._host.nativeElement);
				brnDialog.mutableCloseOnOutsidePointerEvents().set(true);
				this.mutableBrnDialogTriggerFor().set(brnDialog);
			});
		});
	}
}
