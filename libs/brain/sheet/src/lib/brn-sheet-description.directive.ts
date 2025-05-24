import { Directive } from '@angular/core';
import { BrnDialogDescriptionDirective } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnSheetDescription]',
	host: {
		'[id]': '_id()',
	},
})
export class BrnSheetDescriptionDirective extends BrnDialogDescriptionDirective {}
