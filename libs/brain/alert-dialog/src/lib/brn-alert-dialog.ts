import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { BrnDialog, type BrnDialogDefaultOptions, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';

export const BRN_ALERT_DIALOG_DEFAULT_OPTIONS: Partial<BrnDialogDefaultOptions> = {
	closeOnBackdropClick: false,
	closeOnOutsidePointerEvents: false,
	role: 'alertdialog',
};

@Component({
	selector: 'brn-alert-dialog',
	exportAs: 'brnAlertDialog',
	providers: [
		{
			provide: BrnDialog,
			useExisting: forwardRef(() => BrnAlertDialog),
		},
		provideBrnDialogDefaultOptions(BRN_ALERT_DIALOG_DEFAULT_OPTIONS),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ng-content />
	`,
})
export class BrnAlertDialog extends BrnDialog {}
