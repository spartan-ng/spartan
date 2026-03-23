import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'hlm-select,[hlmSelect],brn-select[hlm]',
	host: {
		'data-slot': 'select',
	},
})
export class HlmSelect {
	constructor() {
		classes(() => 'space-y-2');
	}
}
