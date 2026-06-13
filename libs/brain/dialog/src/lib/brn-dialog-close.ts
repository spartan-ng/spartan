import { Directive } from '@angular/core';
import { BrnOverlayClose } from '@spartan-ng/brain/overlay';

@Directive({
	selector: 'button[brnDialogClose]',
})
export class BrnDialogClose extends BrnOverlayClose {}
