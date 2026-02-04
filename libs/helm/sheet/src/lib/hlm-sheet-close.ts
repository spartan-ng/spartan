import { Directive } from '@angular/core';
import { BrnSheetClose } from '@spartan-ng/brain/sheet';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'button[hlmSheetClose]',
	hostDirectives: [{ directive: BrnSheetClose, inputs: ['delay'] }],
	host: {
		'data-slot': 'sheet-close',
	},
})
export class HlmSheetClose {
	constructor() {
		classes(() => 'absolute top-4 right-4');
	}
}
