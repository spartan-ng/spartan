import { Directive } from '@angular/core';
import { BrnAlertDialogContent } from '@spartan-ng/brain/alert-dialog';

@Directive({
	selector: '[hlmAlertDialogPortal]',
	exportAs: 'hlmAlertDialogPortal',
	hostDirectives: [{ directive: BrnAlertDialogContent, inputs: ['context', 'class'] }],
})
export class HlmAlertDialogPortal {}
