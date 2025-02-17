import { Directive, effect, input, untracked } from '@angular/core';
import { BrnDialogTriggerDirective } from '@spartan-ng/brain/dialog';
import type { BrnAlertDialogComponent } from './brn-alert-dialog.component';

@Directive({
	selector: 'button[brnAlertDialogTrigger],button[brnAlertDialogTriggerFor]',
	standalone: true,
	host: {
		'[id]': 'id()',
		'aria-haspopup': 'dialog',
		'[attr.aria-expanded]': "state() === 'open' ? 'true': 'false'",
		'[attr.data-state]': 'state()',
		'[attr.aria-controls]': 'dialogId',
	},
})
export class BrnAlertDialogTriggerDirective extends BrnDialogTriggerDirective {
	public readonly brnAlertDialogTriggerFor = input<BrnAlertDialogComponent | undefined>();

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
