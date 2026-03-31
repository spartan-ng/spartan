import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmCardTitle]',
	host: {
		'data-slot': 'card-title',
	},
})
export class HlmCardTitle {
	constructor() {
		classes(() => 'spartan-card-title');
	}
}
