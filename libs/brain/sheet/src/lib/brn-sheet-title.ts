import { Directive } from '@angular/core';
import { BrnDialogTitle } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnSheetTitle]',
	host: {
		'[id]': '_id()',
	},
})
export class BrnSheetTitle extends BrnDialogTitle {}
