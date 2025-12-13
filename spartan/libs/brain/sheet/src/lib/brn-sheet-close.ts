import { Directive, forwardRef } from '@angular/core';
import { BrnDialogClose } from '@spartan-ng/brain/dialog';

@Directive({
	selector: 'button[brnSheetClose]',
	providers: [{ provide: BrnDialogClose, useExisting: forwardRef(() => BrnSheetClose) }],
})
export class BrnSheetClose extends BrnDialogClose {}
