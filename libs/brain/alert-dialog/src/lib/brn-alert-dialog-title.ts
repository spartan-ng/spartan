import { Directive } from '@angular/core';
import { BrnDialogTitle } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnAlertDialogTitle]',
	hostDirectives: [BrnDialogTitle],
})
export class BrnAlertDialogTitle {}
