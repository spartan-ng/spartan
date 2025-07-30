import { Directive } from '@angular/core';
import { BrnDialogClose } from '@spartan-ng/brain/dialog';

@Directive({
	selector: 'button[brnPopoverClose]',
})
export class BrnPopoverClose extends BrnDialogClose {}
