import { Directive, inject, input } from '@angular/core';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAlertDialogContent],hlm-alert-dialog-content',
	exportAs: 'hlmAlertDialogContent',
	host: {
		'data-slot': 'alert-dialog-content',
		'[attr.data-state]': 'state()',
		'[attr.data-size]': 'size()',
	},
})
export class HlmAlertDialogContent {
	private readonly _dialogRef = inject(BrnDialogRef);
	public readonly state = this._dialogRef.state;

	public readonly size = input<'sm' | 'default'>('default');

	constructor() {
		classes(() => 'spartan-alert-dialog-content group/alert-dialog-content grid w-[calc(100vw-2rem)] outline-none');
	}
}
