import { Directive } from '@angular/core';
import { BrnSheetClose } from '@spartan-ng/brain/sheet';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'button[hlmSheetClose]',
	hostDirectives: [{ directive: BrnSheetClose, inputs: ['delay'] }],
})
export class HlmSheetClose {
	constructor() {
		classes(() => 'absolute end-4 top-4');
	}
}
