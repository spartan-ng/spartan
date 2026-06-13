import { Directive, input, signal } from '@angular/core';
import { injectExposesStateProvider } from '@spartan-ng/brain/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAlertDialogContent],hlm-alert-dialog-content',
	host: {
		'data-slot': 'alert-dialog-content',
		'[attr.data-state]': 'state()',
		'[attr.data-size]': 'size()',
		// Enter/exit animations coordinated natively by Angular (animate.enter on
		// attach, animate.leave on close/detach), replacing the data-state animation
		// utilities so close() waits for the exit animation instead of a timed teardown.
		'animate.enter': 'animate-in fade-in-0 zoom-in-95 duration-200',
		'animate.leave': 'animate-out fade-out-0 zoom-out-95 duration-200',
	},
})
export class HlmAlertDialogContent {
	private readonly _stateProvider = injectExposesStateProvider({ optional: true, host: true });
	public readonly state = this._stateProvider?.state ?? signal('closed');

	public readonly size = input<'sm' | 'default'>('default');

	constructor() {
		classes(() => 'spartan-alert-dialog-content group/alert-dialog-content grid w-full outline-none');
	}
}
