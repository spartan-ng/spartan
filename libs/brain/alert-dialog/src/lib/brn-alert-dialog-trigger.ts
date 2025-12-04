import { Directive, effect, input, untracked } from '@angular/core';
import { BrnDialogTrigger } from '@spartan-ng/brain/dialog';
import type { BrnAlertDialog } from './brn-alert-dialog';

@Directive({
	selector: 'button[brnAlertDialogTrigger],button[brnAlertDialogTriggerFor]',
	host: {
		'[id]': 'id()',
		'aria-haspopup': 'dialog',
		'[attr.aria-expanded]': "state() === 'open' ? 'true': 'false'",
		'[attr.data-state]': 'state()',
		'[attr.aria-controls]': 'dialogId',
		'[type]': 'type()',
	},
})
export class BrnAlertDialogTrigger extends BrnDialogTrigger {
	public readonly brnAlertDialogTriggerFor = input<BrnAlertDialog | undefined>();

	constructor() {
		super();
		effect(() => {
			const brnDialog = this.brnAlertDialogTriggerFor();
			untracked(() => {
				if (brnDialog) {
					this.mutableBrnDialogTriggerFor().set(brnDialog);
				}
			});
		});
	}
}
