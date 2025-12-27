import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmDialogHeader],hlm-dialog-header',
	host: {
		'data-slot': 'dialog-header',
	},
})
export class HlmDialogHeader {
	constructor() {
		classes(() => 'flex flex-col gap-2 text-center sm:text-start');
	}
}
