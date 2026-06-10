import { Directive, input, signal } from '@angular/core';
import { injectExposesStateProvider } from '@spartan-ng/brain/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAlertDialogContent],hlm-alert-dialog-content',
	host: {
		'data-slot': 'alert-dialog-content',
		'[attr.data-state]': 'state()',
		'[attr.data-size]': 'size()',
	},
})
export class HlmAlertDialogContent {
	private readonly _stateProvider = injectExposesStateProvider({ optional: true, host: true });
	public readonly state = this._stateProvider?.state ?? signal('closed');

	public readonly size = input<'sm' | 'default'>('default');

	constructor() {
		classes(() => 'spartan-alert-dialog-content group/alert-dialog-content grid w-[calc(100vw-2rem)] outline-none');
	}
}
