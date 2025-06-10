import { Directive } from '@angular/core';
import { BrnDialogDescriptionDirective } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnAlertDialogDescription]',
	host: {
		'[id]': '_id()',
	},
})
export class BrnAlertDialogDescriptionDirective extends BrnDialogDescriptionDirective {}
