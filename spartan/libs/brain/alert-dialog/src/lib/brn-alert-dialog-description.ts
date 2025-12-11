import { Directive } from '@angular/core';
import { BrnDialogDescription } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnAlertDialogDescription]',
	hostDirectives: [BrnDialogDescription],
})
export class BrnAlertDialogDescription {}
