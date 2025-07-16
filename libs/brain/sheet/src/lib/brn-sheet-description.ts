import { Directive } from '@angular/core';
import { BrnDialogDescription } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnSheetDescription]',
	host: {
		'[id]': '_id()',
	},
})
export class BrnSheetDescription extends BrnDialogDescription {}
