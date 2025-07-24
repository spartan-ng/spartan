import { Directive } from '@angular/core';
import { BrnDialogDescription } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnAlertDialogDescription]',
	host: {
		'[id]': '_id()',
	},
})
export class BrnAlertDialogDescription extends BrnDialogDescription {}
