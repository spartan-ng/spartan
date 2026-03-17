import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmSelectGroup],hlm-select-group',
	host: {
		role: 'group',
		'data-slot': 'select-group',
	},
})
export class HlmSelectGroup {
	constructor() {
		classes(() => 'scroll-my-1 p-1');
	}
}
