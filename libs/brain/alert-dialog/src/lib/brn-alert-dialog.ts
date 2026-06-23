import { Directive, forwardRef } from '@angular/core';
import { BrnDialog, type BrnDialogDefaultOptions, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';

export const BRN_ALERT_DIALOG_DEFAULT_OPTIONS: Partial<BrnDialogDefaultOptions> = {
	disableClose: true,
	closeOnOutsidePointerEvents: false,
	role: 'alertdialog',
};

@Directive({
	selector: '[brnAlertDialog],brn-alert-dialog',
	exportAs: 'brnAlertDialog',
	providers: [
		{
			provide: BrnDialog,
			useExisting: forwardRef(() => BrnAlertDialog),
		},
		provideBrnDialogDefaultOptions(BRN_ALERT_DIALOG_DEFAULT_OPTIONS),
	],
})
export class BrnAlertDialog extends BrnDialog {}
