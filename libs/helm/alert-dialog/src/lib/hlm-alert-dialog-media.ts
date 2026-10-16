import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAlertDialogMedia],hlm-alert-dialog-media',
	exportAs: 'hlmAlertDialogMedia',
	host: { 'data-slot': 'alert-dialog-media' },
})
export class HlmAlertDialogMedia {
	constructor() {
		classes(() => 'spartan-alert-dialog-media');
	}
}
