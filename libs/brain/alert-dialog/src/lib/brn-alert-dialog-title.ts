import { Directive } from '@angular/core';
import { BrnDialogTitle } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnAlertDialogTitle]',
	host: {
		'[id]': '_id()',
	},
})
export class BrnAlertDialogTitle extends BrnDialogTitle {}
