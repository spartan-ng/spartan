import { Directive } from '@angular/core';
import { BrnDialogCloseDirective } from '@spartan-ng/brain/dialog';

@Directive({
	selector: 'button[brnSheetClose]',
})
export class BrnSheetCloseDirective extends BrnDialogCloseDirective {}
