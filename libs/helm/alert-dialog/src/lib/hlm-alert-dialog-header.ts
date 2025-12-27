import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAlertDialogHeader],hlm-alert-dialog-header',
	host: {
		'data-slot': 'alert-dialog-header',
	},
})
export class HlmAlertDialogHeader {
	constructor() {
		classes(() => 'flex flex-col gap-2 text-center sm:text-start');
	}
}
