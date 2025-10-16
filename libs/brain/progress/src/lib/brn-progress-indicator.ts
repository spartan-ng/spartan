/* eslint-disable @angular-eslint/directive-selector */
import { Directive } from '@angular/core';
import { injectBrnProgress } from './brn-progress.token';

@Directive({
	selector: 'brn-progress-indicator',
	host: {
		'[attr.data-state]': '_progress.state()',
		'[attr.data-value]': '_progress.value()',
		'[attr.data-max]': '_progress.max()',
	},
})
export class BrnProgressIndicator {
	protected readonly _progress = injectBrnProgress();
}
