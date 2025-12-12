import { Directive } from '@angular/core';
import { HlmInput } from '@spartan-ng/helm/input';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'input[hlmInputGroupInput]',
	hostDirectives: [HlmInput],
	host: {
		'data-slot': 'input-group-control',
	},
})
export class HlmInputGroupInput {
	constructor() {
		classes(() => `flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent`);
	}
}
