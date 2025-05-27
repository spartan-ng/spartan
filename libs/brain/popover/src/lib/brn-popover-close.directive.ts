import { Directive } from '@angular/core';
import { BrnDialogCloseDirective } from '@spartan-ng/brain/dialog';

@Directive({
	selector: 'button[brnPopoverClose]',
})
export class BrnPopoverCloseDirective extends BrnDialogCloseDirective {}
