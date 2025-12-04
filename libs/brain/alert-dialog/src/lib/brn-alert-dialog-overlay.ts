import { Directive } from '@angular/core';
import { provideCustomClassSettableExisting } from '@spartan-ng/brain/core';
import { BrnDialogOverlay } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnAlertDialogOverlay],brn-alert-dialog-overlay',
	providers: [provideCustomClassSettableExisting(() => BrnAlertDialogOverlay)],
})
export class BrnAlertDialogOverlay extends BrnDialogOverlay {}
