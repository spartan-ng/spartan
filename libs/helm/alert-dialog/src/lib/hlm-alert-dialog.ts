import { ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation } from '@angular/core';
import {
	BRN_ALERT_DIALOG_DEFAULT_OPTIONS,
	BrnAlertDialog,
	BrnAlertDialogOverlay,
} from '@spartan-ng/brain/alert-dialog';
import { BrnDialog, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';
import { HlmAlertDialogOverlay } from './hlm-alert-dialog-overlay';

@Component({
	selector: 'hlm-alert-dialog',
	template: `
		<brn-alert-dialog-overlay hlm />
		<ng-content />
	`,
	providers: [
		{
			provide: BrnDialog,
			useExisting: forwardRef(() => HlmAlertDialog),
		},
		provideBrnDialogDefaultOptions({
			...BRN_ALERT_DIALOG_DEFAULT_OPTIONS,
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	exportAs: 'hlmAlertDialog',
	imports: [BrnAlertDialogOverlay, HlmAlertDialogOverlay],
})
export class HlmAlertDialog extends BrnAlertDialog {}
