import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmInputGroup],hlm-input-group',
	host: {
		'data-slot': 'input-group',
		role: 'group',
	},
})
export class HlmInputGroup {
	constructor() {
		classes(
			() =>
				'group/input-group spartan-input-group relative flex w-full min-w-0 items-center outline-none has-[>textarea]:h-auto',
		);
	}
}
