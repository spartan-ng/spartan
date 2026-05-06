import { Directive } from '@angular/core';
import { HlmInput } from '@spartan-ng/helm/input';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'input[hlmSidebarInput]',
	hostDirectives: [HlmInput],
	host: {
		'data-slot': 'sidebar-input',
		'data-sidebar': 'input',
	},
})
export class HlmSidebarInput {
	constructor() {
		classes(() => 'spartan-sidebar-input');
	}
}
