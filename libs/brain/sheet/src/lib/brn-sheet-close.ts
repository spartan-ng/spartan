import { Directive } from '@angular/core';
import { BrnDialogClose } from '@spartan-ng/brain/dialog';

@Directive({
	selector: 'button[brnSheetClose]',
	exportAs: 'brnSheetClose',
})
export class BrnSheetClose extends BrnDialogClose {}
