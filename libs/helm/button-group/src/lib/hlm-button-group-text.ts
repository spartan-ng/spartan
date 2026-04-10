import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmButtonGroupText],hlm-button-group-text',
	host: {
		'data-slot': 'button-group-text',
	},
})
export class HlmButtonGroupText {
	constructor() {
		classes(() => 'spartan-button-group-text flex items-center [&_ng-icon]:pointer-events-none');
	}
}
