import { Directive } from '@angular/core';
import { BrnDialogTitleDirective } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnAlertDialogTitle]',
	host: {
		'[id]': '_id()',
	},
})
export class BrnAlertDialogTitleDirective extends BrnDialogTitleDirective {}
