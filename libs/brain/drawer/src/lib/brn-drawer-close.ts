import { Directive } from '@angular/core';
import { BrnDialogClose } from '@spartan-ng/brain/dialog';

@Directive({
	selector: 'button[brnDrawerClose]',
})
export class BrnDrawerClose extends BrnDialogClose {}
